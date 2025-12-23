#include <windows.h>
#include <wdf.h>

// Minimal UMDF driver entry point
NTSTATUS DriverEntry(
    _In_ PDRIVER_OBJECT  DriverObject,
    _In_ PUNICODE_STRING RegistryPath
)
{
    // ...
    return STATUS_SUCCESS;
}
