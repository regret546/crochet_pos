import Swal from "sweetalert2";

export const confirmDelete = async (action, itemName = "item") => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `This ${itemName} will be permanently deleted.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      Swal.fire({
        title: "Deleting...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      await action();

      await Swal.fire(
        "Deleted!",
        `The ${itemName} has been removed.`,
        "success"
      );
    } catch (err) {
      console.error(err);
      await Swal.fire("Error!", `Failed to delete the ${itemName}.`, "error");
    }
  }
};
