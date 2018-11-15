import moment from "moment";
export  function DateFormat(time,fomatStr) {   
    time=GetDateDiff(time);
    var date = new Date(time);
    var nowtime = new Date();
    if(date.getDate()==nowtime.getDate()){
        return "今天 "+moment(date).format("HH:mm");
    }
    if(date.getDate()==nowtime.getDate()+1){
        return "明天 "+moment(date).format("HH:mm");
    }
    return moment(date).format(fomatStr);
  }

function GetDateDiff(data) {  
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式   
    if(data==null||data==''){
        return null;
    }
    return data = data.replace(/\-/g, "/");
}
