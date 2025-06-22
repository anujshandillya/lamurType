import clsx from "clsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { CommandType } from "@/data/commands";
import { usePreferenceContext } from "@/context/Preference/PreferenceContext";
import { filterCommands, handleSelect } from "./functions";

const SpotlightSearch = ({ data }: { data: CommandType[] }) => {
  const {
    preferences: { theme, fontFamily, isOpen },
    dispatch,
  } = usePreferenceContext();
  const [commands, setCommands] = useState(data);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  const [page, setPage] = useState<1 | 2>(1);

  useEffect(() => {
    if (selected && page === 1) {
      setQuery("");
      setPage(2);
      setCommands((command) => {
        const selectedCommand = command.filter(
          (item) => item.commandName === selected
        );
        console.log("selectedCommand", selectedCommand);
        if (selectedCommand.length === 0) return data;

        return selectedCommand[0].contents;
      });
    }
  }, [selected, page, data]);

  const filteredCommands = useMemo(
    () => filterCommands(commands, query),
    [commands, query]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (page === 2 && event.key === "Escape") {
        setPage(1);
        setCommands(data);
        setSelected("");
        setQuery("");
        return;
      }
      if (
        (event.key === "p" || event.key === "k") &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        dispatch({ type: "TOGGLE_COMMAND_PALETTE" });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [page]);

  //   console.log("query", query);
  //   console.log("commands", commands);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        dispatch({ type: "TOGGLE_COMMAND_PALETTE" });
      }}
    >
      <DialogContent>
        <Command>
          <CommandInput
            placeholder="Search for commands..."
            className="h-9"
            onChangeCapture={(e: FormEvent<HTMLInputElement>) => {
              const value = e.currentTarget.value;
              setQuery(value);
            }}
          />
          <CommandList>
            <CommandEmpty>No commands found.</CommandEmpty>
            <CommandGroup>
              {filteredCommands.map((command) => (
                <CommandItem
                  key={command.commandName}
                  value={command.commandName}
                  className={`bg-${command.commandName}-bg text-${command.commandName}-font`}
                  onSelect={(currentValue) => {
                    if (currentValue === 'exit') {
                      dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
                      setQuery('');
                      setPage(1);
                      setCommands(data);
                      setSelected('');
                      return;
                    }
                    console.log("currentValue", currentValue);
                    setSelected(currentValue)
                    if (page === 2) {
                      handleSelect(selected, currentValue, dispatch);
                      dispatch({ type: "TOGGLE_COMMAND_PALETTE" });
                      setPage(1);
                      setCommands(data);
                      setSelected('');
                    }
                  }}
                >
                  {`${command.commandName} ${command.description}`}
                  
                  {/* <Check
                    className={cn(
                      "ml-auto",
                      value === command.value ? "opacity-100" : "opacity-0"
                    )}
                  /> */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SpotlightSearch;
