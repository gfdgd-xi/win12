// v4.3.0
let userdata={
  'theme':'light',
  'color1':'#ad6eca',
  'color2':'#3b91d8'
};
this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res ||
        fetch(event.request)
          .then(responese => {
            const responeseClone = responese.clone();
            caches.open('def').then(cache => {
              console.log('下载数据',responeseClone.url);
              cache.put(event.request, responeseClone);
            })
            return responese;
          })
          .catch(err => {
            console.log(err);
          });
    })
  )
});
const cacheNames = ['def'];
let nochanges=[
  '/win12/fonts/',
  '/win12/icon/',
  '/win12/img/',
  '/win12/apps/icons/',
  '/win12/jq.min.js'
]
let flag = false;
this.addEventListener('activate', function (event) {
  flag = true;
  console.log('开始更新');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all[keys.map(key => {
        if (!cacheNames.includes(key)) {
          console.log('清除原始版本数据');
          return caches.delete(key);
        }
      })]
    })
  );
  event.waitUntil(
    caches.keys().then(keys => {
      if(keys.includes('def')){
        caches.open('def').then(cc=>{
          cc.keys().then(key=>{
            key.forEach(k => {
              let fl=true;
              nochanges.forEach(fi => {
                if(RegExp(fi+'\\S+').test(k.url)){
                  fl=false;
                  return;
                }
              });
              if(fl){
                console.log('删除数据',k.url);
                return cc.delete(k);
              }
            });
          })
        })
      }
    })
  );
  event.waitUntil(
    caches.open('def').then(function (cache) {
			return cache.addAll([
				'bg-dark.svg'
			]);
		})
  );
});
this.addEventListener('message', function (e) {
  if (e.data.head == 'is_update') {
    if (flag) {
      e.source.postMessage({
        head:'update'
      });
      flag = false;
    }
  }else if (e.data.head=='set_userdata'){
    userdata[e.data.key]=e.data.value;
    console.log(userdata)
  }else if (e.data.head=='get_userdata'){
    console.log(userdata);
    e.source.postMessage({
      head:'userdata',
      data:userdata
    });
  }
});