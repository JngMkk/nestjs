import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments): string => {
  if (args.constraints.length !== 2) {
    return minLengthValidationMessage(args);
  }
  return `최소 ${args.constraints[0]}자 이상, 최대 ${args.constraints[1]}자 이하여야 합니다.`;
};

export const minLengthValidationMessage = (
  args: ValidationArguments,
): string => {
  return `최소 ${args.constraints[0]}자 이상이어야 합니다.`;
};

export const maxLengthValidationMessage = (
  args: ValidationArguments,
): string => {
  return `최대 ${args.constraints[0]}자 이하여야 합니다.`;
};

export const stringValidationMessage = (args: ValidationArguments): string => {
  return `'${args.property}'는 문자열이어야 합니다.`;
};
