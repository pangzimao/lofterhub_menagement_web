import request from "@/utils/request2"

export function getSupplier(query){
    return request({
        url: '/dashboard/provider/retrieve',
        method: 'get',
        params:query
      })
}