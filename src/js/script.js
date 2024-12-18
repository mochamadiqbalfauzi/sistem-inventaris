document.addEventListener("DOMContentLoaded", () => {
  const showFormButton = document.getElementById("showFormButton");
  const addItemFormContainer = document.getElementById("addItemFormContainer");
  const addItemForm = document.getElementById("addItemForm");
  const cancelButton = document.getElementById("cancelButton");
  const itemTableBody = document.getElementById("itemTableBody");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const downloadCSVButton = document.getElementById("downloadCSV");

  let editingIndex = -1; // Variabel untuk menyimpan index item yang sedang diedit

  // Fungsi untuk menampilkan form penambahan barang
  showFormButton.addEventListener("click", () => {
    addItemFormContainer.classList.remove("hidden");
    showFormButton.classList.add("hidden"); // Sembunyikan tombol tambah
    editingIndex = -1; // Reset index edit saat membuka form
    addItemForm.reset(); // Reset form
  });

  // Fungsi untuk menyembunyikan form penambahan barang
  cancelButton.addEventListener("click", () => {
    addItemFormContainer.classList.add("hidden");
    showFormButton.classList.remove("hidden"); // Tampilkan tombol tambah
    editingIndex = -1; // Reset index edit saat membatalkan
    addItemForm.reset(); // Reset form
  });

  // Ambil data barang dari localStorage
  const getItemsFromStorage = () => {
    return JSON.parse(localStorage.getItem("items")) || [];
  };

  // Simpan data barang ke localStorage
  const saveItemsToStorage = (items) => {
    localStorage.setItem("items", JSON.stringify(items));
  };

  // Update tampilan daftar barang
  const renderItems = () => {
    const items = getItemsFromStorage();
    const searchQuery = searchInput.value.toLowerCase();
    const filterCategory = categoryFilter.value;

    // Filter data barang berdasarkan pencarian dan kategori
    const filteredItems = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery) || searchQuery === "";
      const matchesCategory =
        filterCategory === "" || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    itemTableBody.innerHTML = "";
    filteredItems.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td class="px-4 py-2 border">${item.name}</td>
            <td class="px-4 py-2 border">${item.category}</td>
            <td class="px-4 py-2 border">${item.quantity}</td>
            <td class="px-4 py-2 border">${item.totalPrice}</td>
            <td class="px-4 py-2 border">${item.date}</td>
            <td class="px-4 py-2 border">
              <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="editItem(${index})">Edit</button>
              <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="deleteItem(${index})">Delete</button>
            </td>
        `;
      itemTableBody.appendChild(row);
    });
  };

  // Fungsi untuk menambah barang
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = document.getElementById("itemName").value;
    const itemCategory = document.getElementById("itemCategory").value;
    const itemQuantity = parseInt(
      document.getElementById("itemQuantity").value
    );
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);
    const itemDate = document.getElementById("itemDate").value;

    const items = getItemsFromStorage();

    if (editingIndex === -1) {
      // Menambah barang baru
      items.push({
        name: itemName,
        category: itemCategory,
        quantity: itemQuantity,
        totalPrice: itemQuantity * itemPrice,
        date: itemDate,
      });
    } else {
      // Edit barang yang sudah ada
      items[editingIndex] = {
        name: itemName,
        category: itemCategory,
        quantity: itemQuantity,
        totalPrice: itemQuantity * itemPrice,
        date: itemDate,
      };
    }

    saveItemsToStorage(items);
    renderItems();
    addItemFormContainer.classList.add("hidden");
    showFormButton.classList.remove("hidden");
  });

  // Fungsi untuk mengedit barang
  window.editItem = (index) => {
    const items = getItemsFromStorage();
    const item = items[index];

    document.getElementById("itemName").value = item.name;
    document.getElementById("itemCategory").value = item.category;
    document.getElementById("itemQuantity").value = item.quantity;
    document.getElementById("itemPrice").value =
      item.totalPrice / item.quantity;
    document.getElementById("itemDate").value = item.date;

    editingIndex = index;
    addItemFormContainer.classList.remove("hidden");
    showFormButton.classList.add("hidden");
  };

  // Fungsi untuk menghapus barang
  window.deleteItem = (index) => {
    const items = getItemsFromStorage();
    items.splice(index, 1);
    saveItemsToStorage(items);
    renderItems();
  };

  // Fungsi untuk mengunduh CSV
  downloadCSVButton.addEventListener("click", () => {
    const items = getItemsFromStorage();
    if (items.length === 0) {
      alert("Tidak ada data barang untuk diunduh.");
      return;
    }

    const header = [
      "Nama Barang",
      "Kategori",
      "Jumlah Barang",
      "Harga Total",
      "Tanggal Masuk",
    ];
    const rows = items.map((item) => [
      item.name,
      item.category,
      item.quantity,
      item.totalPrice,
      item.date,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += header.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_barang.csv");
    link.click();
  });

  // Event listener untuk pencarian dan filter
  searchInput.addEventListener("input", renderItems);
  categoryFilter.addEventListener("change", renderItems);

  renderItems();
});
