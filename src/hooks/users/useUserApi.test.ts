import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { toast } from "react-toastify";
import { ILoginData, IUnregisteredUser } from "../../interfaces/users/User";
import Wrapper from "../../utils/Wrapper";
import useUser from "./useUsersApi";

jest.mock("react-toastify");

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

const mockUseDispatch = jest.fn();

jest.mock("../../app/store/hooks", () => ({
  ...jest.requireActual("../../app/store/hooks"),
  useAppDispatch: () => mockUseDispatch,
}));

describe("Given a useUser hook", () => {
  describe("When invoke register function with a mockUser", () => {
    test("Then it should redirect to the list page", async () => {
      const mockUser: IUnregisteredUser = {
        firstName: "Adam",
        firstSurname: "Super",
        userEmail: "adam@gmail.com",
        password: "adampass",
      };

      const {
        result: {
          current: { registerUser },
        },
      } = renderHook(useUser, { wrapper: Wrapper });

      await waitFor(() => {
        registerUser(mockUser);
      });

      await waitFor(() => {
        expect(mockUseNavigate).toHaveBeenCalledWith("/complaints");
      });
    });
  });

  describe("When invoke register function with a mockUser without required properties", () => {
    test("Then it should send a modal error", async () => {
      const mockUser2: IUnregisteredUser = {
        firstName: "Adam",
        firstSurname: "Super",
        userEmail: "adam@gmail.com",
        password: "",
      };

      const {
        result: {
          current: { registerUser },
        },
      } = renderHook(useUser, { wrapper: Wrapper });
      await registerUser(mockUser2);

      expect(toast.error).toHaveBeenCalledWith(
        "NoOoOoOoo! Email already exists.",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        }
      );
    });
  });

  describe("When invoke login function with a mockUser", () => {
    test("Then it should dispatch the login action", async () => {
      const mockUser3 = {
        userEmail: "mizuki@gmaimizukil.com",
        password: "mizuki",
      };

      const {
        result: {
          current: { loginUser },
        },
      } = renderHook(useUser, { wrapper: Wrapper });

      await act(async () => {
        await loginUser(mockUser3);
      });

      await waitFor(() => {
        expect(mockUseDispatch).toHaveBeenCalled();
      });
    });

    describe("When invoke login function with the wrong data", () => {
      test("Then it should show an error toaster", async () => {
        const mockUser: ILoginData = {
          userEmail: "adam@gmail.com",
          password: "",
        };

        const {
          result: {
            current: { loginUser },
          },
        } = renderHook(useUser, { wrapper: Wrapper });

        await loginUser(mockUser);

        expect(toast.error).toHaveBeenCalledWith(
          "User or password not valid.",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          }
        );
      });
    });
  });
});
