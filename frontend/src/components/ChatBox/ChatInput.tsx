// import { useRoomContext } from '@/context/Room/RoomContext';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Iconify from "../Iconify";
import { useForm } from "react-hook-form";
import FormProvider from "../hook-form/FormProvider";
import RHFTextField from "../hook-form/RHFTextField";

const ChatInput = ({ isPublic }: { isPublic: boolean }) => {
  //   const {
  //     room: {
  //       socket,
  //       user: { username, roomId, id },
  //     },
  //   } = useRoomContext();
  const defaultValue = {
    message: "",
  };

  const messageSchema = Yup.object().shape({
    message: Yup.string().trim().min(1).max(280).required(),
  });

  const methods = useForm<typeof defaultValue>({
    resolver: yupResolver(messageSchema),
    defaultValues: defaultValue,
  });

  const { handleSubmit, watch } = methods;

  const values = watch();

  const onSubmit = (data: typeof defaultValue) => {
    // handle sockets
    console.log("Submitted data:", data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-12 w-full items-center justify-between border-t px-2 sm:px-4">
        <RHFTextField name="message" helperText={values.message} />
        <button
          className="relative h-full border-b px-2 text-sm font-normal"
          type="submit"
        >
          <span className="flex items-center text-fg transition-opacity duration-200 hover:text-opacity-80 active:text-opacity-70">
            Send
            <Iconify icon="mdi:send" />
          </span>
        </button>
      </div>
    </FormProvider>
  );
};

export default ChatInput;
