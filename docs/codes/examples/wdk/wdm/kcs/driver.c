#include <ntddk.h>
#include "kcsCounters.h"

NTSTATUS DriverEntry(
    _In_ PDRIVER_OBJECT  DriverObject,
    _In_ PUNICODE_STRING RegistryPath
)
{
    // ...
    return STATUS_SUCCESS;
}
