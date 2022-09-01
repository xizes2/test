import axios from "axios";
import { toast } from "react-toastify";
import { UnregisteredUser } from "../interfaces/users/User";

export const loadingModal = (message: string) =>
  toast.loading(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 2000,
  });

export const successModal = (message: string) =>
  toast.success(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
  });

export const errorModal = (error: string) =>
  toast.error(error, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
  });

const useUser = () => {
  const registerUser = async (registerData: UnregisteredUser) => {
    const url: string = `${process.env.REACT_APP_API_URL}users/register`;
    try {
      loadingModal("Give us a second...");
      const data = await axios.post(url, registerData);
      successModal("Registered with success!");
      return data;
    } catch (error) {
      errorModal("NoOoOoOoo! Please try again.");
    }
  };

  return { registerUser };
};

export default useUser;
