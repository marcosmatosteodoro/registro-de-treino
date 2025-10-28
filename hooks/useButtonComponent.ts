import { ButtonGrey, ButtonOrange, ButtonPurple } from "@/components";

export const useButtonComponent = () => {
  const getButtonComponent = (index: number) => {
    switch (index) {
      case 0: return ButtonOrange;
      case 1: return ButtonPurple;
      default: return ButtonGrey;
    }
  };

  return {
    getButtonComponent
  };
};