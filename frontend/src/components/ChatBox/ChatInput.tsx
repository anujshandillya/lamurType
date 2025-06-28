// import { useRoomContext } from '@/context/Room/RoomContext';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Iconify from "../Iconify";
import { useForm } from "react-hook-form";
import FormProvider from "../hook-form/FormProvider";
import RHFTextField from "../hook-form/RHFTextField";
import { usePreferenceContext } from "@/context/Preference/PreferenceContext";
import { useRoomContext } from "@/context/Room/RoomContext";
import Button from "../shared/Button";

const ChatInput = ({ isPublic }: { isPublic: boolean }) => {
    const {
      room: {
        socket,
        user: { username, roomId, id },
      },
    } = useRoomContext();
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

  const { preferences: { theme } } = usePreferenceContext();

  const { handleSubmit, setValue } = methods;

  const onSubmit = (data: typeof defaultValue) => {
    // handle sockets
    console.log("Submitted data:", data);
        const { message: value } = data
        if (!value) return;
        if (isPublic) {
          socket.emit('send chat', { username, value, roomId: 'public', id });
          setValue('message', '');
          return;
        }
        socket.emit('send chat', { username, value, roomId, id });
        setValue('message', '');
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-16 w-full items-center gap-3 border-t px-4">
        <div className="flex-1">
          <RHFTextField 
            name="message" 
            label="Type a message..." 
            fullWidth={true}
          />
        </div>
        <Button
          className="h-10 px-4 text-sm font-medium"
          type="submit"
        >
          <span className={`flex items-center gap-2 text-${theme}-fg transition-opacity duration-200 hover:text-opacity-80 active:text-opacity-70`}>
            Send
            <Iconify icon="mdi:send" className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </FormProvider>
  );
};

export default ChatInput;
