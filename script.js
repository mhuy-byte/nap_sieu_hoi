const ADMIN_PIN = "123456"; // Đổi mã PIN tại đây

// --- CƠ CHẾ ẨN: Click 5 lần vào Logo hoặc ấn Ctrl + Shift + A ---
let clickCount = 0;
let clickTimer = null;

document.querySelector('.logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  clickCount++;
  clearTimeout(clickTimer);
  if (clickCount >= 5) {
    openAdmin();
    clickCount = 0;
  } else {
    clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    openAdmin();
  }
});

// --- BẬT / TẮT BẢNG ADMIN ---
function openAdmin() {
  document.getElementById('adminModal').style.display = 'flex';
}

function closeAdmin() {
  document.getElementById('adminModal').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminAuth').style.display = 'block';
  document.getElementById('adminPin').value = '';
}

function verifyAdmin() {
  const pin = document.getElementById('adminPin').value;
  if (pin === ADMIN_PIN) {
    document.getElementById('adminAuth').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderOrders();
  } else {
    alert('Mật khẩu Admin không đúng!');
  }
}

// --- XỬ LÝ DỮ LIỆU ĐƠN HÀNG ---
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const tbody = document.getElementById('orderTableBody');
  
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="padding: 15px;">Chưa có đơn hàng nào</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map((order, index) => `
    <tr>
      <td>#${order.id || index + 1}</td>
      <td>${order.account || 'N/A'}</td>
      <td>${order.game || 'N/A'}</td>
      <td>${order.package || 'N/A'}</td>
      <td><b>${order.status || 'Chờ xử lý'}</b></td>
      <td>
        <button onclick="updateOrderStatus(${index}, 'Thành công')">Duyệt</button>
        <button onclick="updateOrderStatus(${index}, 'Hủy')">Hủy</button>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(index, newStatus) {
  let orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders[index].status = newStatus;
  localStorage.setItem('orders', JSON.stringify(orders));
  renderOrders();
}
