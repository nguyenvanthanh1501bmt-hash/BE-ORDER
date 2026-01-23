export function getSizeExtraPrice(option, sizeText) {
  // Validate inputs
  if (!Array.isArray(option) || !sizeText) return 0

  // Find index of selected size in option list
  const index = option.findIndex(opt => opt === sizeText)

  // If size is not found, no extra charge
  if (index === -1) return 0

  // Extra price increases by 5000 per size level
  return index * 5000
}