import request from "@/utils/request2"

export function getAirport(data){
    return request({
        url: '/dashboard/airport/configuration/retrieve',
        method: 'post',
        data
      })
}

export function createAirport(data){
  return request({
      url: '/dashboard/airport/configuration/upload',
      method: 'post',
      data
    })
}

export function editAirport(data){
  return request({
      url: '/dashboard/airport/configuration/edit',
      method: 'post',
      data
    })
}

export function getAllSupplier(){
    return request({
        url: '/dashboard/provider/retrieve/all',
        method: 'get',
        
      })
}


export function updateTraffic(data){
    return request({
        url: '/dashboard/airport/configuration/update-traffic',
        method: 'post',
        data
      })
  }
  