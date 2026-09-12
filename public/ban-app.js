const products=[
{id:1,name:'Classic Bun Tee',price:1200,cat:'clothing',icon:'👕',desc:'Everyday cotton T-shirt with The Bun style.'},
{id:2,name:'Bun Hoodie',price:2800,cat:'clothing',icon:'🧥',desc:'A cozy hoodie for cool days.'},
{id:3,name:'Bun Cap',price:900,cat:'accessories',icon:'🧢',desc:'Simple cap with a clean Bun look.'},
{id:4,name:'Bun Tote Bag',price:750,cat:'accessories',icon:'👜',desc:'Reusable tote for school, shopping and more.'},
{id:5,name:'Bun Mug',price:650,cat:'home',icon:'☕',desc:'Your everyday mug with a little Bun energy.'},
{id:6,name:'Bun Sticker Pack',price:300,cat:'accessories',icon:'✨',desc:'A fun pack of stickers for your stuff.'}
];
let cart=JSON.parse(localStorage.getItem('bun_cart')||'[]');
const $=s=>document.querySelector(s);
const money=n=>`KSh ${n.toLocaleString()}`;
function save(){localStorage.setItem('bun_cart',JSON.stringify(cart));updateCart();}
function updateCart(){const count=cart.reduce((a,x)=>a+x.qty,0);$('#cartCount').textContent=count;renderCart();}
function renderProducts(cat='all'){
 const list=cat==='all'?products:products.filter(p=>p.cat===cat);$('#productCount').textContent=`${list.length} products`;
 $('#productGrid').innerHTML=list.map(p=>`<article class="product"><div class="product-art ${p.cat}"><span>${p.icon}</span><small>${p.cat}</small></div><div class="product-body"><div><h3>${p.name}</h3><p>${p.desc}</p></div><b>${money(p.price)}</b><button class="primary full" onclick="addToCart(${p.id})">Add to cart</button></div></article>`).join('');
}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});save();$('#cartPanel').classList.remove('hidden');$('#cartMsg').textContent=`Added ${p.name} to your cart.`;}
function renderCart(){const box=$('#cartItems');if(!box)return;if(!cart.length){box.innerHTML='<p class="muted">Your cart is empty.</p>';$('#cartTotal').textContent=money(0);$('#checkoutBtn').disabled=true;return;}$('#checkoutBtn').disabled=false;box.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-row"><span>${p.icon} <b>${p.name}</b><small>${money(p.price)} each</small></span><div><button onclick="changeQty(${p.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join('');$('#cartTotal').textContent=money(cart.reduce((sum,x)=>sum+products.find(p=>p.id===x.id).price*x.qty,0));}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);save();}
function closePanels(){$('#cartPanel').classList.add('hidden');$('#checkoutPanel').classList.add('hidden');}
document.querySelectorAll('.category').forEach(b=>b.onclick=()=>{document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.cat);});
$('#cartBtn').onclick=()=>$('#cartPanel').classList.remove('hidden');$('#closeCart').onclick=()=>$('#cartPanel').classList.add('hidden');$('#closeCheckout').onclick=()=>$('#checkoutPanel').classList.add('hidden');
$('#checkoutBtn').onclick=()=>{if(!cart.length)return;$('#cartPanel').classList.add('hidden');$('#checkoutPanel').classList.remove('hidden');};
$('#checkoutForm').onsubmit=e=>{e.preventDefault();const orderId='BUN-'+Date.now().toString().slice(-6);$('#orderMsg').textContent=`Order ${orderId} received! We'll contact you using the details provided. This demo does not process payment yet.`;cart=[];save();e.target.reset();};
renderProducts();updateCart();
