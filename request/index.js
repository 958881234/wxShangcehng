// 封装Promise 异步请求，封装请求头
let ajaxTimes=0; //解决同时发送多个请求，loading显示问题,上面次数++，下面--
export const request = (params)=>{

  // 判断 url中是否带有 /my/ 请求的是私有路径 带上 header token
  let header = {...params.header};
  if(params.url.includes("/my/")){//拼接header 带上token
    header["Authorization"]=wx.getStorageSync("token");
  }

  ajaxTimes++;
  // 显示加载中效果
  wx.showLoading({
    title: '加载中...',
    mask:true
  })
  // 定义公共URL
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(res)=>{
        // resolve(res);
        resolve(res.data.message);
      },
      fail:(eerr)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
          wx.hideLoading();//关闭等待loading图标
        }
      }
    });
  })
}