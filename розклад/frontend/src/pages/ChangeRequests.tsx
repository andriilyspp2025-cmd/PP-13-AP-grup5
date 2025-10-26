import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { changeRequestApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Check, X, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default function ChangeRequests() {
  const { user } = useAuthStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const queryClient = useQueryClient()

  const { data: requests, isLoading } = useQuery({
    queryKey: ['change-requests', filter],
    queryFn: () => changeRequestApi.getRequests(filter === 'all' ? {} : { status: filter }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      changeRequestApi.updateRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] })
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      toast.success('Request updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update request')
    },
  })

  const handleApprove = (id: number) => {
    updateMutation.mutate({
      id,
      data: { status: 'approved' },
    })
  }

  const handleReject = (id: number) => {
    const comment = window.prompt('Please provide a reason for rejection:')
    if (comment) {
      updateMutation.mutate({
        id,
        data: { status: 'rejected', admin_comment: comment },
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getChangeTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Change Requests</h1>
        <p className="mt-2 text-gray-600">
          {isAdmin ? 'Review and process change requests' : 'View your change requests'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md font-medium capitalize ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading requests...</p>
        </div>
      ) : requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request: any) => (
            <div key={request.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {getChangeTypeLabel(request.change_type)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Requested Date:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {format(new Date(request.requested_date), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">Reason:</span>
                      <p className="mt-1 text-sm text-gray-900">{request.reason}</p>
                    </div>

                    {request.admin_comment && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Admin Comment:</span>
                        <p className="mt-1 text-sm text-gray-900">{request.admin_comment}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Submitted {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>

                {isAdmin && request.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={updateMutation.isPending}
                      className="btn btn-primary p-2"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={updateMutation.isPending}
                      className="btn btn-danger p-2"
                      title="Reject"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No change requests found.</p>
        </div>
      )}
    </div>
  )
}

