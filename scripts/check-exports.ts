import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Directories to check
const directories = ["app", "components", "lib", "context", "hooks"]

// File extensions to check
const extensions = [".ts", ".tsx"]

// Files that are allowed to use default exports
const allowDefaultExportFiles = ["app/layout.tsx", "app/page.tsx", "middleware.ts"]

// Pattern to match page files in the app directory
const pagePattern = /app\/.*\/page\.tsx$/
const layoutPattern = /app\/.*\/layout\.tsx$/

function isAllowedDefaultExport(filePath: string): boolean {
  if (allowDefaultExportFiles.includes(filePath)) return true
  if (pagePattern.test(filePath)) return true
  if (layoutPattern.test(filePath)) return true
  return false
}

function checkFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, "utf8")

    // Check for default exports
    const hasDefaultExport = /export\s+default/.test(content)

    // Check for named exports
    const namedExportMatches = content.match(/export\s+(const|function|class|type|interface|enum)\s+(\w+)/g)
    const namedExports = namedExportMatches
      ? namedExportMatches.map((match) => {
          const parts = match.split(/\s+/)
          return parts[parts.length - 1]
        })
      : []

    // Check for re-exports
    const reExportMatches = content.match(/export\s+{\s*([^}]+)\s*}\s+from/g)
    const reExports = reExportMatches
      ? reExportMatches.flatMap((match) => {
          const exportList = match.replace(/export\s+{\s*|\s*}\s+from.*/g, "")
          return exportList.split(",").map((e) =>
            e
              .trim()
              .split(/\s+as\s+/)[0]
              .trim(),
          )
        })
      : []

    // Log issues
    const relativePath = path.relative(process.cwd(), filePath)

    if (hasDefaultExport && !isAllowedDefaultExport(relativePath)) {
      console.warn(`⚠️  ${relativePath}: Uses default export but should use named exports`)
    }

    if (namedExports.length === 0 && reExports.length === 0 && !isAllowedDefaultExport(relativePath)) {
      console.warn(`⚠️  ${relativePath}: No named exports found`)
    }

    console.log(
      `✓ ${relativePath}: ${namedExports.length + reExports.length} named exports, ${hasDefaultExport ? "has" : "no"} default export`,
    )
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error)
  }
}

function walkDirectory(dir: string): void {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== "node_modules" && file !== ".next") {
        walkDirectory(filePath)
      }
    } else if (extensions.includes(path.extname(file))) {
      checkFile(filePath)
    }
  }
}

console.log("Checking export patterns...")
directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    walkDirectory(dir)
  }
})

console.log("\nRunning ESLint export checks...")
try {
  execSync("npm run lint:exports", { stdio: "inherit" })
} catch (error) {
  console.error("ESLint found export issues. Please fix them before deploying.")
  process.exit(1)
}

console.log("\n✅ Export check completed")
