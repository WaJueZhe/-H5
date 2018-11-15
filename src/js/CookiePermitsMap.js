import { setCookie, getCookie }  from "./cookie.js";

// 获取所有类型的权限Map集合
// permitsMap 的格式：{"permitType":["permitCode1","permitCode1"],"permitType":["permitCode1","permitCode1"]} 
//              例如: {"extra_service_list":["1"],"userAllMenuCodes":["m008001","m008"]}
export function getPermitsMap(){
    return JSON.parse(getCookie("permitsMap"));
}

// 返回：某一类型权限code的数组；不存在值某一权限类型，则返回：undefined
export function getPermitsByType(type){
    let permits = [];
    if(getCookie("permitsMap")){
        permits = JSON.parse(getCookie("permitsMap"))[type];
    } else {
        permits = undefined;
    }
    return permits;
}