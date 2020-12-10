import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BotService } from '../bot.service';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BotComponent implements OnInit {

constructor(private api:BotService) { }
userQueries:any=['order status'];
data:any=[];
flag:boolean=true;

currentStep: any = -9999;
answersGiven:any =  {}
conversation: any =[{  
  'q' : 'How can i help you? ',
  'ans': {
    'yes':()=> { this.gotoQuestion(1)},
    'yeah':()=> { this.gotoQuestion(1)},
    'yup':()=> { this.gotoQuestion(1)},
    'order':()=> { this.gotoQuestion(1)},
    'pizza':()=> { this.gotoQuestion(1)},
    'check':()=> { this.gotoQuestion(9)},
    'status':()=> { this.gotoQuestion(9)},
    'details':()=> { this.gotoQuestion(9)},
    'detail':()=> { this.gotoQuestion(9)},
    'cancel':()=> { this.gotoQuestion(10)},
    'no': () => { this.gotoQuestion(8)},
    'not': () => { this.gotoQuestion(8)},
    'none': () => { this.gotoQuestion(8)}
  },
  'ansType':"not-custom",
  'err': () => { 
    this.sendBotMSg("Sorry i dont understand"); 
    this.gotoQuestion(0);
  }
},
{
  'q': 'What do you prefer veg or non veg?',
  'ans': {
    'non veg': () => { this.gotoQuestion(3)},
    'nonveg': () => { this.gotoQuestion(3)},
    'veg':()=> { this.gotoQuestion(2)}
  },
  'ansType':'orderData',
  'name':'pizzatype',
  'err': () => { 
    this.sendBotMSg("Sorry i dont understand"); 
    this.gotoQuestion(0);
  }
},
{
  'q':'Choose one from the following:<br> 1.Margherita <br> 2.Double Cheese Margherita <br> 3.Farm house <br> 4.Peppy panner <br> 5.Cheese and panner',
  'ans': {
    'margherita':()=>{this.gotoQuestion(4)},
    'double cheese margherita':()=>{this.gotoQuestion(4)},
    'farm house':()=>{this.gotoQuestion(4)},
    'peppy panner':()=>{this.gotoQuestion(4)},
    'cheese and panner':()=>{this.gotoQuestion(4)},
  },
  'ansType':'orderData',
  'name':'pizzaname',
  'err': () => { 
    this.sendBotMSg("Sorry we dont have that pizza! Try another pizza"); 
    this.gotoQuestion(0);
  }
},
{
  'q':'Choose one from the following:<br> 1.Pepper Barbecue Chicken <br> 2.Chicken Sausage <br> 3.Chicken Golden Delight <br> 4.Non Veg Supreme <br> 5.Indi Chicken Tikka',
  'ans': {
    'pepper barbecue chicken':()=>{this.gotoQuestion(4)},
    'chicken sausage':()=>{this.gotoQuestion(4)},
    'chicken golden delight':()=>{this.gotoQuestion(4)},
    'non veg supreme':()=>{this.gotoQuestion(4)},
    'indi chicken tikka':()=>{this.gotoQuestion(4)},
  },
  'ansType':'orderData',
  'name':'pizzaname',
  'err': () => { 
    this.sendBotMSg("Sorry we dont have that pizza! Try another pizza"); 
    this.gotoQuestion(0);
  }
},
{
  'q': 'Which size you want to order? <br> Small <br> Medium or<br> Large',
  'ans': { 
    'small':()=> { this.gotoQuestion(5)},
    'medium': () => { this.gotoQuestion(5)},
    'large': () => { this.gotoQuestion(5)}
  },
  'ansType': "orderData",
  'name':'pizzasize',
  'err': () => { 
    this.sendBotMSg("Sorry we dont have requested size"); 
    this.gotoQuestion(0);
  }
},
{
  'q': 'What is your name? ',
  'ans': { },
  'ansType': "custom",
  'name':'customername',
  'answerHandler':()=>{
    this.sendBotMSg("Thanks for answering!");
    this.gotoQuestion(6);
  }
},
{
  'q': 'Can you give us your address details',
  'ans': { },
  'ansType': "custom",
  'name':'address',
  'answerHandler':()=>{this.gotoQuestion(7);}
},
{
  'q': 'What is your mobile number',
  'ans': { },
  'ansType': "custom",
  'name':'phonenumber',
  'answerHandler':()=>{this.gotoQuestion(8);},
  'err': () => { 
    this.sendBotMSg("Please enter a valid mobile number"); 
    this.gotoQuestion(0);
  }
},
{
  'endOfQ' : true,
  'end':()=>{ this.sendBotMSg("Conversation came to end ");
      this.gotoQuestion(-1);
    },
  'answerHandler': () =>{ this.api.makeAnOrder(this.answersGiven.pizzatype,this.answersGiven.pizzaname,this.answersGiven.customername,this.answersGiven.phonenumber,this.answersGiven.address).subscribe((data) =>{
    console.log(data);
    if(data.status != 'Ok'){
      this.conversation[8]['err']();
    }else{
      this.sendBotMSg("Order confirmed with ID : "+data.insertId); 
      this.gotoQuestion(0);
    }
  })},
  'err': () => { 
    this.sendBotMSg("I can't order pizza now !"); 
    this.gotoQuestion(0);
  }
},
{
  'q': 'Can you please send your order ID to check order status ',
  'ans':{},
  'answerHandler': (id:string) =>{this.api.getDataByOrderId(id).subscribe(data => {
    if(Object.keys(data).length === 0){
      this.conversation[9]['err']();
    }else{
      data = data[0];
      this.sendBotMSg("Your order confirmed with order Id "+data.orderid+ ". You ordered "+data.pizzatype+" "+data.pizzaname+". Your pizza will be delivered soon to "+data.address); 
      this.gotoQuestion(0);
    }
  })},
  'ansType': "individual",
  'err': () => { 
    this.sendBotMSg("Sorry there is no order with that ID ,Order pizza now"); 
    this.gotoQuestion(0);
  }
},
{
  'q': 'Can you please send your order ID to cancel your order',
  'ans': { },
  'answerHandler': (id:string) =>{ this.api.cancelOrder(id).subscribe(data => {
    if(data.affectedRows == 0){
      this.conversation[10]['err']();
    }else{
      this.sendBotMSg("Order cancelled having ID : "+id); 
      this.gotoQuestion(0);
    }
  })},
  'ansType': "individual",
  'err': () => { 
    this.sendBotMSg("Sorry there is no order with that ID ,Order pizza now"); 
    this.gotoQuestion(0);
  }
}];


gotoQuestion(step:any): void{
  var value;
  step==0 ?value=true:value=false;

  this.currentStep = step;
  if(step==-1) return;
  var question = this.conversation[step];
  if (question && question['endOfQ'] == true)  question.answerHandler();
  else  this.sendBotMSg(question.q,value);
}

handleUserResponse(step:any, message: string): void{
  if(step==-1){
    this.gotoQuestion(0);
    return;
  }

  var num:any = message.match(/(\d+)/); 
  var question = this.conversation[step];
  var keys:any = Object.keys(question['ans']);

  if (question.ansType == 'custom') {
    if(question.name == 'phonenumber')
      if(message.match(/^\d{10}$/) == null)
        return question.err();

    this.answersGiven[question.name]= message;
    question.answerHandler();
    return;
  }
  else if(question.ansType == 'individual'){
    question.answerHandler(num[0]);
    // question.answerHandler(message);
    return;
  }
  else{
    for (let index = 0; index < keys.length; index++) {
      var key :any = keys[index];
      if((step == 2 || step == 3) && num != null){
        var temp : any = Object.keys(question.ans);
        key = temp[num[0]-1];
        if( key != undefined){
          this.answersGiven[question.name]= key;
          return question.ans[temp[num[0]-1]]();
        } 
      }
      else if(message.includes(key)){  
        if (question.ansType == 'orderData') {
          this.answersGiven[question.name]= key;
        }
        question.ans[key]();
        return;
      }
    }
    question.err(); 
  } 
}

getRandomTime():any{
  var times = [500, 1000, 1500, 2000];
  return times[Math.floor(Math.random()*times.length)]
}

sendBotMSg(msg: string ,isInit:boolean = false): void {
  setTimeout(()=>{
    var bot = document.createElement('div');
    bot.innerHTML = msg;
    bot.setAttribute('class', 'bot-message');
    document.getElementById('message')?.appendChild(bot);

    var messages = document.getElementById('message');
    messages!.scrollTop = messages!.scrollHeight;
    document.getElementById('message')?.appendChild(document.createElement('br'));

    if(isInit){
      
      var orderPizza = document.createElement('button');
      orderPizza.innerHTML='Order Pizza';    
      orderPizza.setAttribute('class', 'order-pizza');
      orderPizza.onclick=()=>{
        this.sendUserMSg('Order pizza!');
        this.gotoQuestion(1);
      };
      document.getElementById('message')?.appendChild(orderPizza);

      var cancelOrder = document.createElement('button');
      cancelOrder.innerHTML='Cancel Order';    
      cancelOrder.setAttribute('class', 'check-status');
      cancelOrder.onclick=()=>{
        this.sendUserMSg('Cancel my order');
        this.gotoQuestion(10);
      };
      document.getElementById('message')?.appendChild(cancelOrder);
      
      document.getElementById('message')?.appendChild(document.createElement('br'));

      var checkStatus = document.createElement('button');
      checkStatus.innerHTML='Check Your Order Status';    
      checkStatus.setAttribute('class', 'cancel-order');
      checkStatus.onclick=()=>{
        this.sendUserMSg('Check my order status');
        this.gotoQuestion(9);
      };
      document.getElementById('message')?.appendChild(checkStatus);
      document.getElementById('message')?.appendChild(document.createElement('br'));
      
    }
  },10);//this.getRandomTime());
}

sendUserMSg(msg: string): void {
  var userinput = document.createElement('div');
  userinput.innerHTML = msg;    
  userinput.setAttribute('class', 'user-message');
  document.getElementById('message')?.appendChild(userinput);

  var messages = document.getElementById('message');
  document.getElementById('message')?.appendChild(document.createElement('br'));
}

checkUserMessage(queries:string ,message:string):void{
  // if(message.includes('cancel') && message.includes('order')){
  // this.sendBotMSg('what is your order id');
  // this.api.cancelOrder(message).subscribe(message => {
  //   console.log(message);
  // });
  // this.api.getOrders();
  // this.api.makeAnOrder(message).subscribe(data => {
  //   console.log(data);
  // });
  // this.api.getDataByOrderName('liki');
}

ngOnInit(): void {
   document.getElementById('form__input')!.onkeypress = function(e) {
    if(e.keyCode == 13) {
      document.getElementById("send-button")!.click();
    }
  }
  this.gotoQuestion(0);
}
  
  
message(message:string){
  (<HTMLInputElement>document.getElementById("form__input")).value=''
  if(message==''){
    alert("Please enter the message");
    return;
  }
  this.sendUserMSg(message);
  this.handleUserResponse(this.currentStep, message.toLowerCase());
}

}
