import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9", // Light background color for the entire container
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  txtMain: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },  
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    backgroundColor: "#ddd", // Slightly darker gray for the header row
    paddingHorizontal: 10,
  },
  headerCell: {
    fontWeight: "bold",
    flex: 1, // Make each cell take equal space
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#fff", // White background for data rows
    marginVertical: 5, // Space between rows
    borderRadius: 5, // Rounded corners
    paddingHorizontal: 10,
  },
  cell: {
    flex: 1, // Make each cell take equal space
  },
  deleteButton: {
    backgroundColor: "#ff4d4d", // Red color for the delete button
    padding: 5, // Padding inside the delete button
    borderRadius: 5, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
  },
  txtClose: {
    color: "#ff4d4d", // Red color for the 'Close' text
    fontSize: 16, // Font size for the 'Close' text
  },
  btnSave: {
    backgroundColor: "#4CAF50", // Green color for the save button
    padding: 10, // Padding inside the save button
    borderRadius: 8, // Rounded corners
    marginTop: 10, // Margin at the top
    alignItems: "center",
  },
  txtInput: {
    borderWidth: 1, // Border width for the input fields
    borderColor: "#ccc", // Light gray border color
    borderRadius: 8, // Rounded corners
    padding: 10, // Padding inside the input field
    marginBottom: 10, // Space below each input field
  },
  btnAddNew: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  
});

export default styles;
