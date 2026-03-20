using System.Runtime.InteropServices;

int sum = NativeMethods.add(3, 4);
int product = NativeMethods.multiply(5, 6);
Console.WriteLine($"add(3,4)={sum}");
Console.WriteLine($"multiply(5,6)={product}");

internal static class NativeMethods {
    private const string NativeLib = "mathlib";

    [DllImport(NativeLib)]
    internal static extern int add(int a, int b);

    [DllImport(NativeLib)]
    internal static extern int multiply(int a, int b);
}
