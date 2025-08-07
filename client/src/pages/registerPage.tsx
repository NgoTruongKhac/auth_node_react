import FormRegister from "../components/formRegister";
import ModalOTP from "../components/modalOTP";
import { useShowModalStore } from "../store/useShowModalStore";

export default function RegisterPage() {
  const showModal = useShowModalStore((state) => state.showModal);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl">register</h1>
      <FormRegister />

      <dialog open={showModal} id="modal_otp" className="modal">
        <ModalOTP />
      </dialog>
    </div>
  );
}
