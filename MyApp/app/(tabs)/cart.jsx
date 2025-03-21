// import React, { useEffect, useState } from "react";
// import {
//   Text,
//   View,
//   SafeAreaView,
//   ScrollView,
//   Button,
//   Alert,
//   TouchableOpacity,
//   Modal,
//   TextInput,
// } from "react-native";
// import axios from "axios";
// import Icon from "react-native-vector-icons/Ionicons"; // Import the icon library
// import { styles } from "../css/styles";

// const App = () => {
//   const [modalData, setModalData] = useState(false);
//   const [fishType, setFishType] = useState("");
//   const [source, setSource] = useState("");
//   const [price, setPrice] = useState("");
//   const [weight, setWeight] = useState("");
//   const [error, setError] = useState("");
//   const [list, setList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     listData();
//   }, []);

//   const validateCapitalization = (input) => /^[A-Z]/.test(input);

//   const handleSaveModal = async () => {
//     if (!validateCapitalization(fishType)) {
//       setError("Fish Type must start with a capital letter.");
//       return;
//     }
//     if (!validateCapitalization(source)) {
//       setError("Source must start with a capital letter.");
//       return;
//     }

//     const formData = { fishType, source, price, weight };

//     try {
//       const response = await axios.post("http://192.168.1.8:4000/api/market-data", formData);
//       console.log("Response Data:", response.data);

//       listData();
//       setModalData(false);
//       clearForm();
//     } catch (error) {
//       console.error("Error saving data:", error.response || error.message);
//     }
//   };

//   const clearForm = () => {
//     setFishType("");
//     setSource("");
//     setPrice("");
//     setWeight("");
//     setError("");
//   };

//   const listData = () => {
//     axios
//       .get("http://192.168.1.8:4000/api/data")
//       .then((response) => {
//         // console.log("Fetched Data:", response.data);
//         // Sort data to display the most recent on top
//         const sortedData = (response.data || []).sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setList(sortedData);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   };

//   const handleDelete = async (id) => {
//     setIsDeleting(true);
//     try {
//       await axios.delete(`http://192.168.1.8:4000/api/market-data/${id}`);
//       Alert.alert("Success", "Data deleted successfully.");
//       listData(); // Refresh the list
//     } catch (error) {
//       console.error("Error deleting data:", error);
//       Alert.alert("Error", "Failed to delete data.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchTerm(text);
//   };

//   // Filter list based on search term
//   const filteredList = list.filter(
//     (item) =>
//       item.fishType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.source.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Modal visible={modalData}>
//         <SafeAreaView>
//           <View style={[styles.headerContainer, { padding: 10 }]}>
//             <Text style={{ fontSize: 20, fontWeight: "bold" }}>Market Data</Text>
//             <TouchableOpacity onPress={() => setModalData(false)}>
//               <Text style={styles.txtClose}>Close</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
//             <Text>Fish Type</Text>
//             <TextInput
//               style={styles.txtInput}
//               placeholder={"Fish Type"}
//               value={fishType}
//               onChangeText={(text) => setFishType(text)}
//             />
//             <Text>Source</Text>
//             <TextInput
//               style={styles.txtInput}
//               placeholder={"Source"}
//               value={source}
//               onChangeText={(text) => setSource(text)}
//             />
//             <Text>Price</Text>
//             <TextInput
//               style={styles.txtInput}
//               placeholder={"Price"}
//               value={price}
//               onChangeText={(text) => setPrice(text)}
//               keyboardType="numeric"
//             />
//             <Text>Weight</Text>
//             <TextInput
//               style={styles.txtInput}
//               placeholder={"Kg"}
//               value={weight}
//               onChangeText={(text) => setWeight(text)}
//               keyboardType="numeric"
//             />
//             {error ? <Text style={{ color: "red", marginTop: 5 }}>{error}</Text> : null}
//             <TouchableOpacity onPress={handleSaveModal} style={styles.btnSave}>
//               <Text style={{ color: "white", fontSize: 20 }}>Save</Text>
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       </Modal>

//       <View style={styles.headerContainer}>
//         <Text style={styles.txtMain}>Market Monitoring ({list?.length || 0} items)</Text>
//         <TouchableOpacity onPress={() => setModalData(true)} style={styles.btnAddNew}>
//           <Text style={{ color: "white", fontSize: 16 }}>New Item</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.searchContainer}>
//         <Icon name="search-outline" size={20} color="#ccc" style={{ marginRight: 10 }} />
//         <TextInput
//           style={styles.searchBar}
//           placeholder="Search by Fish Type or Source"
//           value={searchTerm}
//           onChangeText={handleSearch}
//         />
//       </View>

//       {/* Table Headers */}
//       <View style={styles.headerRow}>
//         <Text style={styles.headerCell}>Fish Type</Text>
//         <Text style={styles.headerCell}>Source</Text>
//         <Text style={styles.headerCell}>Price</Text>
//         <Text style={styles.headerCell}>Weight</Text>
//         <Text style={styles.headerCell}></Text>
//       </View>

//       {/* Scrollable Table Body */}
//       <ScrollView>
//       {filteredList.length > 0 ? (
//         filteredList.map((data) => (
//           <View key={data._id} style={styles.dataRow}>
//             <Text style={styles.cell}>{data.fishType}</Text>
//             <Text style={styles.cell}>{data.source}</Text>
//             <Text style={styles.cell}>{data.price}</Text>
//             <Text style={styles.cell}>{data.weight} Kg</Text>
//             <TouchableOpacity
//               onPress={() => handleDelete(data._id)}
//               style={styles.deleteButton}
//             >
//               <Icon name="trash-outline" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.emptyState}>No matching data found.</Text>
//       )}
//     </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default App;
