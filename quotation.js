// Input fields
const fields = ["name", "ic", "phone", "email", "plate", "postcode", "note"];

// Auto load saved data
window.onload = () => {
  fields.forEach(id => {
    if(localStorage.getItem(id)) {
      document.getElementById(id).value = localStorage.getItem(id);
    }
  });
};

// Auto save when typing
fields.forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    localStorage.setItem(id, document.getElementById(id).value);
  });
});

// Clear data
function clearData(){
  if(confirm("Padam semua data?")){
    fields.forEach(id => localStorage.removeItem(id));
  }
}

// Send ke WhatsApp
function sendWhatsApp(){
  let msg = 
`Quotation Request Z-Takaful

Nama: ${name.value}
No IC: ${ic.value}
Telefon: ${phone.value}
Emel: ${email.value}
No Plat: ${plate.value}
Poskod: ${postcode.value}
Nota: ${note.value}`;

  let phoneNumber = "60123456789"; // Tukar ke no WhatsApp Bro
  let url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}
