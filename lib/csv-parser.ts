import Papa from "papaparse"
import { z } from "zod"

// Define the expected CSV structure with Zod schema
export const meterImportSchema = z.object({
  meterNumber: z
    .string()
    .min(8, "Serial number must be at least 8 characters")
    .max(15, "Serial number must be at most 15 characters")
    .regex(/^\d+$/, "Serial number must contain only digits"),
  productId: z.string().min(1, "Product ID is required"),
  location: z.string().optional(),
  notes: z.string().optional(),
})

export type MeterImportRow = z.infer<typeof meterImportSchema>

export type ValidationResult = {
  valid: boolean
  errors: Record<string, string[]>
  data: MeterImportRow[]
}

export async function parseCsvFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve(results.data as string[][])
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

export function validateCsvData(rows: string[][], headers: string[]): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: {},
    data: [],
  }

  // Skip header row if it exists
  const dataRows = rows[0].join("").toLowerCase().includes("meternumber") ? rows.slice(1) : rows

  dataRows.forEach((row, index) => {
    const rowNumber = index + (rows[0].join("").toLowerCase().includes("meternumber") ? 2 : 1)
    const rowData: Record<string, string> = {}

    // Map CSV columns to expected fields
    headers.forEach((header, colIndex) => {
      if (colIndex < row.length) {
        rowData[header] = row[colIndex]?.trim() || ""
      }
    })

    // Validate the row data against our schema
    const validation = meterImportSchema.safeParse(rowData)

    if (!validation.success) {
      result.valid = false
      result.errors[`row-${rowNumber}`] = []

      // Format error messages
      validation.error.errors.forEach((err) => {
        result.errors[`row-${rowNumber}`].push(`${err.path.join(".")}: ${err.message}`)
      })
    } else {
      result.data.push(validation.data)
    }
  })

  return result
}

// Helper function to generate a CSV template
export function generateCsvTemplate(): string {
  const headers = ["meterNumber", "productId", "location", "notes"]
  const csvContent = [headers.join(",")].join("\n")
  return csvContent
}

// Helper function to convert validation errors to a readable format
export function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([row, rowErrors]) => {
      return `${row}: ${rowErrors.join(", ")}`
    })
    .join("\n")
}
