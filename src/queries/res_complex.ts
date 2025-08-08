import { useQuery } from "@tanstack/react-query";
import { pb } from "./client";

const DEFAULT_RES_COMPLEX_ID = 'd757od5um7yfo8b'


export const useResComplex = () => useQuery({
  queryKey: ['res_complex'],
  queryFn: () => {
    const params = new URLSearchParams(window.location.search);
    const resComplexId = params.get('res_complex_id') || DEFAULT_RES_COMPLEX_ID;
    if (!resComplexId) {
      throw new Error('res_complex_id is required');
    }
    return pb.collection('res_complexes').getOne<{
      name: string
    }>(resComplexId)
  }
})