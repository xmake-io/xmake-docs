module hello(
    input clk,
    output reg [7:0] count
);

    always @(posedge clk) begin
        count <= count + 1;
    end

endmodule
