import request from "@/utils/request2"

export function getSupplier(data){
    return request({
        url: '/dashboard/provider/retrieve',
        method: 'post',
        data
      })
}

export function createSupplier(data){
  return request({
      url: '/dashboard/provider/create',
      method: 'post',
      data
    })
}

export function updateSupplier(data){
  return request({
      url: '/dashboard/provider/update',
      method: 'post',
      data
    })
}