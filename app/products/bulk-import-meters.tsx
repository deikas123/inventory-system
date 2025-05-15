"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useInventory } from "@/context/inventory-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Download, FileUp, Plus, Trash2 } from "lucide-react"
import { parseCsvFile, validateCsvData, generateCsvTemplate, type MeterImportRow } from "@/lib/csv-parser"
import { bulkImportMeters, getProductOptions } from "@/lib/services/bulk-import-service"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type BulkImportMetersProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BulkImportMeters({ open, onOpenChange }: BulkImportMetersProps) {
  const { refreshData } = useInventory()
  const [activeTab, setActiveTab] = useState("csv")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<MeterImportRow[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any | null>(null)
  const [manualEntries, setManualEntries] = useState<MeterImportRow[]>([
    { meterNumber: "", productId: "", location: "", notes: "" },
  ])
  const [productOptions, setProductOptions] = useState<{ value: string; label: string }[]>([])
  const [importStep, setImportStep] = useState<"upload" | "preview" | "result">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load product options when the dialog opens
  useState(() => {
    if (open) {
      loadProductOptions()
    }
  })

  const loadProductOptions = async () => {
    const options = await getProductOptions()
    setProductOptions(options)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      setUploadError(null)
    }
  }

  const handleFileUpload = async () => {
    if (!csvFile) {
      setUploadError("Please select a file to upload")
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      // Parse the CSV file
      const rows = await parseCsvFile(csvFile)

      // Validate the data
      const headers = ["meterNumber", "productId", "location", "notes"]
      const validationResult = validateCsvData(rows, headers)

      if (!validationResult.valid) {
        setUploadError(`Validation errors: ${Object.keys(validationResult.errors).length} rows have errors`)
        console.error("Validation errors:", validationResult.errors)
      } else {
        setPreviewData(validationResult.data)
        setImportStep("preview")
      }
    } catch (error) {
      console.error("Error parsing CSV:", error)
      setUploadError("Failed to parse CSV file. Please check the format.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    const template = generateCsvTemplate()
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "meter_import_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleAddManualEntry = () => {
    setManualEntries([...manualEntries, { meterNumber: "", productId: "", location: "", notes: "" }])
  }

  const handleRemoveManualEntry = (index: number) => {
    const newEntries = [...manualEntries]
    newEntries.splice(index, 1)
    setManualEntries(newEntries)
  }

  const handleManualEntryChange = (index: number, field: keyof MeterImportRow, value: string) => {
    const newEntries = [...manualEntries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setManualEntries(newEntries)
  }

  const handlePreviewManualEntries = () => {
    // Filter out empty entries
    const validEntries = manualEntries.filter((entry) => entry.meterNumber && entry.productId)
    if (validEntries.length === 0) {
      setUploadError("Please add at least one valid meter entry")
      return
    }

    setPreviewData(validEntries)
    setImportStep("preview")
  }

  const handleImport = async () => {
    try {
      setIsImporting(true)
      const result = await bulkImportMeters(previewData)
      setImportResult(result)
      setImportStep("result")

      // Refresh the inventory data if any meters were successfully imported
      if (result.successCount > 0) {
        refreshData()
      }
    } catch (error) {
      console.error("Error importing meters:", error)
      setUploadError("Failed to import meters. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    // Reset the state
    setCsvFile(null)
    setUploadError(null)
    setPreviewData([])
    setImportResult(null)
    setManualEntries([{ meterNumber: "", productId: "", location: "", notes: "" }])
    setImportStep("upload")
    onOpenChange(false)
  }

  const handleBackToUpload = () => {
    setImportStep("upload")
    setPreviewData([])
  }

  const renderUploadStep = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>

      <TabsContent value="csv" className="space-y-4 py-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileUp className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4">Upload a CSV file with meter data</p>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              Select File
            </Button>
            <Button variant="outline" onClick={handleDownloadTemplate} disabled={isUploading}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          {csvFile && (
            <div className="mt-4 text-sm">
              Selected file: <span className="font-medium">{csvFile.name}</span>
            </div>
          )}
        </div>

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button onClick={handleFileUpload} disabled={!csvFile || isUploading}>
            {isUploading ? "Processing..." : "Upload and Preview"}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="manual" className="space-y-4 py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm">
            <div className="col-span-3">Serial Number</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-2">Notes</div>
            <div className="col-span-1"></div>
          </div>

          <ScrollArea className="h-[300px]">
            {manualEntries.map((entry, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-3">
                  <Input
                    value={entry.meterNumber}
                    onChange={(e) => handleManualEntryChange(index, "meterNumber", e.target.value)}
                    placeholder="e.g., 58102527205"
                  />
                </div>
                <div className="col-span-3">
                  <Select
                    value={entry.productId}
                    onValueChange={(value) => handleManualEntryChange(index, "productId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {productOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Input
                    value={entry.location || ""}
                    onChange={(e) => handleManualEntryChange(index, "location", e.target.value)}
                    placeholder="e.g., Warehouse"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={entry.notes || ""}
                    onChange={(e) => handleManualEntryChange(index, "notes", e.target.value)}
                    placeholder="Notes"
                  />
                </div>
                <div className="col-span-1 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveManualEntry(index)}
                    disabled={manualEntries.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>

          <Button variant="outline" onClick={handleAddManualEntry} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Meter
          </Button>
        </div>

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handlePreviewManualEntries}
            disabled={manualEntries.every((entry) => !entry.meterNumber || !entry.productId)}
          >
            Preview
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderPreviewStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Preview Import Data</h3>
        <Badge variant="outline">{previewData.length} meters</Badge>
      </div>

      <ScrollArea className="h-[350px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial Number</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.meterNumber}</TableCell>
                <TableCell>{row.productId}</TableCell>
                <TableCell>{row.location || "Warehouse"}</TableCell>
                <TableCell>{row.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ready to import</AlertTitle>
        <AlertDescription>
          You are about to import {previewData.length} meters. This action cannot be undone.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBackToUpload}>
          Back
        </Button>
        <Button onClick={handleImport} disabled={isImporting}>
          {isImporting ? "Importing..." : "Import Meters"}
        </Button>
      </div>
    </div>
  )

  const renderResultStep = () => {
    if (!importResult) return null

    const { success, totalProcessed, successCount, failedCount, errors } = importResult

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Import Results</h3>
          <Badge variant={success ? "success" : failedCount > 0 ? "destructive" : "outline"}>
            {success ? "Success" : failedCount === totalProcessed ? "Failed" : "Partial Success"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {successCount} of {totalProcessed} meters imported
            </span>
          </div>
          <Progress value={(successCount / totalProcessed) * 100} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="border rounded-md p-4">
            <div className="text-2xl font-bold">{totalProcessed}</div>
            <div className="text-sm text-muted-foreground">Total Processed</div>
          </div>
          <div className="border rounded-md p-4 bg-green-50">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-green-600">Successfully Imported</div>
          </div>
          <div className="border rounded-md p-4 bg-red-50">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
        </div>

        {failedCount > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Import Errors</AlertTitle>
            <AlertDescription>
              <ScrollArea className="h-[150px] mt-2">
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium">{key}</span>: {value}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </AlertDescription>
          </Alert>
        )}

        {successCount > 0 && (
          <Alert variant="success" className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Success</AlertTitle>
            <AlertDescription className="text-green-600">
              {successCount} meters were successfully imported into the system.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Meters</DialogTitle>
          <DialogDescription>Import multiple meters at once using a CSV file or manual entry.</DialogDescription>
        </DialogHeader>

        {importStep === "upload" && renderUploadStep()}
        {importStep === "preview" && renderPreviewStep()}
        {importStep === "result" && renderResultStep()}
      </DialogContent>
    </Dialog>
  )
}
