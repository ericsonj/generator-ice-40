/**
 * File:   <%= projectName %>_tb.v
 * Author: <%= username %>
 * Email:  <%= email %>
 * 
 * Created on <%= datetime %>
 */

module <%= projectName %>_tb (/**PORTS**/);

   initial begin

      $dumpfile("<%= projectName %>_tb.vcd");    
      $dumpvars(0, <%= projectName %>_tb);
      # 10 $finish;
        
   end
   
endmodule // <%= projectName %>_tb
