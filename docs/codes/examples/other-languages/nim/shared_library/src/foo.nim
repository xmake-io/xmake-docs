proc add*(a, b: int): int {.exportc, dynlib.} =
  result = a + b
