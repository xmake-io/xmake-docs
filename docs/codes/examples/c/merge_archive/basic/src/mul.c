int add(int, int);
int sub(int, int);

int mul_add_sub(int a, int b) {
    return add(a, b) * sub(a, b);
}
