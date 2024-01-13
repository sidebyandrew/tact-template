import "@stdlib/deploy";

message Add {
    amount: Int as uint32;
}


message Minus {
    amount: Int as uint32;
}

message Multiply {
    amount: Int as uint32;
}

message Divide {
    amount: Int as uint32;
}


contract SampleTactContract with Deployable {

    owner: Address;
    counter: Int as uint32;
    seqno: Int as uint64;

    init(owner: Address, seq: Int) {
        self.owner = owner;
        self.counter = 0;
        self.seqno=seq;
    }

    fun add(v: Int) {
        // Check sender
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");
        
        // Update counter
        self.counter = (self.counter + v);
    }

     fun minus(v: Int) {
            // Check sender
         let ctx: Context = context();
         require(ctx.sender == self.owner, "Invalid sender");

         // Update counter
         self.counter = (self.counter - v);
     }

      fun multiply(v: Int) {
          let ctx: Context = context();
          require(ctx.sender == self.owner, "Invalid sender");
          self.counter = (self.counter * v);
      }

     fun divide(v: Int) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");
        require(v != 0 , "divide 0 is not allowed.");
        self.counter = (self.counter / v);
     }

    receive(msg: Add) {
        self.add(msg.amount);
    }

    receive(msg: Minus) {
        self.minus(msg.amount);
    }

     receive(msg: Multiply) {
        self.multiply(msg.amount);
     }

     receive(msg: Divide) {
        self.divide(msg.amount);
     }

    receive("increment") {
        self.add(1);
        self.reply("incremented".asComment());
    }

     receive("decrement") {
         self.minus(1);
         self.reply("decremented".asComment());
     }

    get fun counter(): Int {
        return self.counter;
    }

    get fun getter(): Int {
        return self.counter;
    }
}