export abstract class Mapper<I, O> {
  abstract mapFrom(param: I): 0;
  abstract mapTo(param: O): I;
}