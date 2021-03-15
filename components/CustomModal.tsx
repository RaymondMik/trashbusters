import React from "react";
import { StyleSheet, Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../store/actions/modal"
import Colors from "../constants";
import { deleteLocation, assignLocation, markLocationAsDone } from "../store/actions/locations";
import { RootState, LocationScreenStatus } from "../types";

const CustomModal = ({ data, navigation, show }: any) => {
   const dispatch = useDispatch();
   const { userId } = useSelector((state: RootState) => state.auth);

   const isAssignedToMe = data.assignedTo === userId;
 
   return (
      <Modal
         isVisible={show}
         coverScreen={false}
         backdropColor={"transparent"}
         onBackdropPress={() => { dispatch(toggleModal()) }}
      >           
         <View style={{...styles.centeredView, marginBottom: data.createdBy === userId ? "-55%" : "-100%" }}>
            <View style={styles.modalView}>
               {data.createdBy === userId && (
                  <>
                     <Pressable
                        style={{...styles.modalButton, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        onPress={() => {
                           dispatch(deleteLocation(data._id, navigation));
                        }}
                     >
                        <Text style={{...styles.textStyle, color: Colors.red }}>Delete</Text>
                     </Pressable>
                     <Pressable
                        style={styles.modalButton}
                        onPress={() => {
                           navigation.navigate("Edit", {
                              title: "Edit location",
                              data: data,
                              status: LocationScreenStatus.Edit
                           })
                           dispatch(toggleModal());
                        }}
                     >
                        <Text style={styles.textStyle}>Edit</Text>
                     </Pressable>
                  </>
               )}
               {data.isOpen && (
                  <Pressable
                     style={{...styles.modalButton,  ...(data.createdBy !== userId && { ...styles.firstButton }) }}
                     onPress={() => {
                        if (isAssignedToMe) {
                           dispatch(assignLocation(data, ""));
                        } else {
                           dispatch(assignLocation(data, userId));
                        }
                     }}
                  >
                     {isAssignedToMe ? (
                        <Text style={styles.textStyle}>Unassign</Text>
                     ) : (
                        <Text style={styles.textStyle}>Assign to me</Text>
                     )}
               </Pressable>
               )}
               {/* {data.isOpen && isAssignedToMe && (
                  <Pressable
                     style={{ ...styles.modalButton, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomWidth: 0 }}
                     onPress={() => {
                        dispatch(markLocationAsDone(data));
                     }}
                  >
                     <Text style={{...styles.textStyle, color: Colors.green}}>Mark as done</Text>
                  </Pressable>
               )}  */}
               <Pressable
                  style={{ ...styles.modalButton, marginTop: 20, borderRadius: 10 }}
                  onPress={() => {
                     dispatch(toggleModal());
                  }}
               >
                  <Text style={styles.textStyle}>Cancel</Text>
               </Pressable>
            </View>
         </View>
      </Modal>
   );
};

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center"
   },
   modalView: {
      width: "100%",
      height: "50%",
      margin: 20,
      backgroundColor: "transparent",
      borderRadius: 20,
      paddingVertical: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
   },
   modalButton: {
      width: "100%",
      paddingVertical: 15,
      borderBottomColor: "#555",
      borderBottomWidth: 1,
      backgroundColor: "rgba(0,0,0,0.9)",
   },
   firstButton: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
   },
   textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
   },
   modalText: {
      marginBottom: 15,
      textAlign: "center"
   }
});

export default CustomModal;