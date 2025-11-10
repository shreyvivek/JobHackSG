// Utility function to format salary strings consistently
export const formatSalary = (salary: string | number | null | undefined): string => {
  // Handle null/undefined
  if (salary === null || salary === undefined) {
    return "Salary not specified";
  }

  // Convert number to string if needed
  let salaryStr: string;
  if (typeof salary === "number") {
    salaryStr = salary.toString();
  } else {
    salaryStr = String(salary); // Ensure it's a string
  }

  if (!salaryStr || !salaryStr.trim()) {
    return "Salary not specified";
  }

  const trimmed = salaryStr.trim();
  
  // If already well-formatted with $ and proper structure, return as is
  if (trimmed.includes("$") && !trimmed.includes("SGD") && (trimmed.includes("-") || trimmed.includes("to") || trimmed.includes("–"))) {
    return trimmed;
  }

  // Remove SGD prefix if present and normalize
  let normalized = trimmed.replace(/SGD\s*/gi, "").trim();
  
  // Handle hourly rates (e.g., "18/hour" or "18/hour")
  if (normalized.toLowerCase().includes("/hour")) {
    const hourlyMatch = normalized.match(/(\d+(?:,\d+)?)/);
    if (hourlyMatch) {
      const hourlyValue = parseInt(hourlyMatch[1].replace(/,/g, ""), 10);
      if (!isNaN(hourlyValue)) {
        return `$${hourlyValue.toLocaleString()}/hour`;
      }
    }
    return `$${normalized}`;
  }

  // Extract numbers, handling commas (e.g., "5,000" or "5000")
  // First, try to find ranges with dash or hyphen (e.g., "5000-7000" or "5000 - 7000")
  const rangeMatch = normalized.match(/^(\d+(?:,\d+)?)\s*[-–]\s*(\d+(?:,\d+)?)$/);
  
  if (rangeMatch) {
    // Range format found (e.g., "5000-7000" or "5,000-7,000")
    const minStr = rangeMatch[1].replace(/,/g, "");
    const maxStr = rangeMatch[2].replace(/,/g, "");
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    
    if (!isNaN(min) && !isNaN(max) && min > 0 && max > 0) {
      // Always display full numbers with commas
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
  }

  // Single value - extract first complete number (handling commas)
  // Match from start of string to ensure we get the full number
  const singleMatch = normalized.match(/^(\d+(?:,\d+)?)/);
  if (singleMatch) {
    const numStr = singleMatch[1].replace(/,/g, "");
    const value = parseInt(numStr, 10);
    
    if (!isNaN(value) && value > 0) {
      // Always display full numbers with commas
      return `$${value.toLocaleString()}`;
    }
  }

  // Fallback: return original string with SGD replaced by $ if needed
  return trimmed.replace(/SGD\s*/gi, "$").trim();
};

