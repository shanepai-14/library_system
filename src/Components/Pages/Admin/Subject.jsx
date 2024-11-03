import React, { useState } from "react";
import DynamicTable from "../../Tables/DynamicTable";
import api from "../../../Utils/interceptor";
import {
  getSubjects,
  deleteSubjects,
  updateSubject,
} from "../../../Utils/endpoint";
import EditModal from "../../Modals/EditModal";
import CreateSubjectModal from "../../Modals/CreateModal";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from "sweetalert2";

const Subjects = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [row, setRow] = useState(5);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch subjects data
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects', page, row, search],
    queryFn: () => api.get(getSubjects(), { 
      params: { page, row, search } 
    }).then(res => res.data),
  });

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newSubjectData) => api.post(getSubjects(), newSubjectData),
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      handleCloseCreateModal();
      Swal.fire({
        title: "Success!",
        text: "New subject has been created.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to create subject. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleCreate = (newSubjectData) => {
    createMutation.mutate(newSubjectData);
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (editedData) => api.put(updateSubject(editedData.id), editedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      handleClose();
      Swal.fire({
        title: "Success!",
        text: "Subject has been updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to update subject. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleSave = (editedData) => {
    updateMutation.mutate(editedData);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(deleteSubjects(id)),
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      Swal.fire("Deleted!", "Subject has been deleted.", "success");
    },
    onError: () => {
      Swal.fire(
        "Error!",
        "There was a problem deleting the subject.",
        "error"
      );
    },
  });

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(row.id);
      }
    });
  };

  const createableColumns = ["code", "name", "description", "year_level", "department", "semester"];
  const editableColumns = ["code", "name", "description", "year_level", "department", "semester"];
  const subjectHeader = [
    { headerName: "Code", align: "left", accessor: "code" },
    { headerName: "Name", align: "left", accessor: "name" },
    { headerName: "Year Level", align: "left", accessor: "year_level" },
    { headerName: "Department", align: "left", accessor: "department" },
    { headerName: "Semester", align: "left", accessor: "semester" },
  ];

  return (
    <>
      <DynamicTable
        createButtonTitle={"ADD SUBJECT"}
        columnsData={subjectHeader}
        data={subjects?.data ?? []}
        showDeleteBtn={true}
        showStatus={false}
        showEditBtn={true}
        showAllRows={false}
        showVIewIcon={false}
        deleteOnClick={() => {}}
        showLoading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
        onSearch={handleSearchChange}
        rowsPerPage={row}
        rowPageCount={subjects?.total ?? 0}
        currentPage={page}
        setRowsPerPage={(e) => setRow(e)}
        setChangePage={(e) => setPage(e)}
        marginTop={"2px"}
        setDeleteOnClick={handleDelete}
        setEditOnClick={handleEdit}
        handleOpenCreateModal={handleOpenCreateModal}
      />

      {selectedRow && (
        <EditModal
          title="Edit Subject"
          editableColumns={editableColumns}
          open={isModalOpen}
          handleClose={handleClose}
          rowData={selectedRow}
          handleSave={handleSave}
        />
      )}

      <CreateSubjectModal
        title="Create Subject"
        open={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleCreate={handleCreate}
        createableColumns={createableColumns}
      />

  
    </>
  );
};

export default Subjects;