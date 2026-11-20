const STORAGE_KEY = "pockettrack_transactions_v1";
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentType = "expense";

const $ = (id) => document.getElementById(id);
const money = (value) => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:2}).format(value);
const today = new Date();
$("date").value = today.toISOString().slice(0,10);
$("monthLabel").textContent = today.toLocaleDateString("en-IN",{month:"short",year:"numeric"});

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); render(); }
function openModal(type="expense"){
  currentType = type;
  document.querySelectorAll(".type-option").forEach(btn=>btn.classList.toggle("chosen",btn.dataset.type===type));
  $("formTitle").textContent = type==="expense" ? "Add expense" : "Add income";
  $("modalBackdrop").classList.add("show");
  $("amount").focus();
}
function closeModal(){ $("modalBackdrop").classList.remove("show"); $("entryForm").reset(); $("date").value=today.toISOString().slice(0,10); }

$("openExpense").addEventListener("click",()=>openModal("expense"));
$("openIncome").addEventListener("click",()=>openModal("income"));
$("navAdd").addEventListener("click",()=>openModal("expense"));
$("closeModal").addEventListener("click",closeModal);
$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal();});
document.querySelectorAll(".type-option").forEach(btn=>btn.addEventListener("click",()=>{
  currentType=btn.dataset.type;
  document.querySelectorAll(".type-option").forEach(b=>b.classList.toggle("chosen",b===btn));
  $("formTitle").textContent=currentType==="expense"?"Add expense":"Add income";
}));

$("entryForm").addEventListener("submit",e=>{
  e.preventDefault();
  const amount=Number($("amount").value);
  const title=$("title").value.trim();
  if(!Number.isFinite(amount)||amount<=0||!title){alert("Please enter a valid amount and title.");return;}
  transactions.unshift({id:Date.now().toString(),type:currentType,amount,title,category:$("category").value,date:$("date").value});
  save();closeModal();
});

function render(){
  const monthKey=today.getFullYear()+"-"+String(today.getMonth()+1).padStart(2,"0");
  const monthItems=transactions.filter(t=>t.date.startsWith(monthKey));
  const expenses=monthItems.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const income=monthItems.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  $("monthTotal").textContent=money(expenses);
  $("incomeTotal").textContent=money(income);
  $("expenseTotal").textContent=money(expenses);
  $("transactionCount").textContent=monthItems.length;
  const categoryTotals={};
  monthItems.filter(t=>t.type==="expense").forEach(t=>categoryTotals[t.category]=(categoryTotals[t.category]||0)+t.amount);
  const top=Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1])[0];
  $("topCategory").textContent=top?top[0]:"—";

  const list=$("transactionList");
  if(!transactions.length){
    list.innerHTML='<div class="empty-state"><div><i class="fa-solid fa-mug-hot"></i></div><h3>No transactions yet</h3><p>Add your first expense or income to get started.</p></div>';
    return;
  }
  const icons={Food:"fa-utensils",Travel:"fa-car",Shopping:"fa-bag-shopping",Bills:"fa-file-invoice",Health:"fa-heart-pulse",Education:"fa-book",Salary:"fa-money-bill-wave",Other:"fa-shapes"};
  list.innerHTML=transactions.slice(0,30).map(t=>`
    <article class="transaction">
      <div class="transaction-icon"><i class="fa-solid ${icons[t.category]||icons.Other}"></i></div>
      <div class="transaction-info"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.category)} · ${formatDate(t.date)}</small></div>
      <div class="transaction-amount ${t.type}">${t.type==="income"?"+":"−"}${money(t.amount)}</div>
      <button class="delete-btn" aria-label="Delete transaction" data-delete="${t.id}"><i class="fa-regular fa-trash-can"></i></button>
    </article>`).join("");
  list.querySelectorAll("[data-delete]").forEach(btn=>btn.addEventListener("click",()=>{
    if(confirm("Delete this transaction?")){transactions=transactions.filter(t=>t.id!==btn.dataset.delete);save();}
  }));
}
function formatDate(value){return new Date(value+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("clearAll").addEventListener("click",()=>{if(transactions.length&&confirm("Delete all transactions? This cannot be undone.")){transactions=[];save();}});
$("navActivity").addEventListener("click",()=>$("transactionList").scrollIntoView({behavior:"smooth",block:"start"}));
render();
