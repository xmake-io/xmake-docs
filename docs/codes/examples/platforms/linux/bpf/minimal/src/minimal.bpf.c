#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>

SEC("tracepoint/syscalls/sys_enter_write")
int handle_tp(void *ctx)
{
    int pid = bpf_get_current_pid_tgid() >> 32;
    char fmt[] = "BPF trigger from PID %d.\n";
    bpf_trace_printk(fmt, sizeof(fmt), pid);
    return 0;
}

char LICENSE[] SEC("license") = "Dual BSD/GPL";
