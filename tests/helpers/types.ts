import { DecodeType, IdlTypes } from "@coral-xyz/anchor";
import { IdlType } from "@coral-xyz/anchor/dist/cjs/idl";
import { ZkSession, IDL } from "../../target/types/zk_session";

export type ZkSessionStruct<
  Name extends string,
  Program = ZkSession
> = UnionToIntersection<ArgsType<ProgramInstruction<Name, Program>>>;

type ProgramInstruction<Name extends string, Program> = InstructionTypeByName<
  Program,
  Name
>;

type InstructionTypeByName<Program, Name extends string> = Program extends {
  instructions: Array<infer I>;
}
  ? I extends { name: Name }
    ? I
    : never
  : never;

type ArgsType<Instruction> = Instruction extends { args: infer Args }
  ? Args extends Array<infer Arg>
    ? Arg extends { name: infer Name; type: infer Type extends IdlType }
      ? Name extends string
        ? // Decodes types that work in Typescript
          { [P in Name]: DecodeType<Type, IdlTypes<typeof IDL>> }
        : never
      : never
    : never
  : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
