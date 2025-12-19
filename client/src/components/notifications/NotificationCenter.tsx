import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  
  const { data: unreadCount } = trpc.notifications.getUnreadCount.useQuery(undefined, {
    refetchInterval: 30000, // Atualizar a cada 30s
  });
  
  const { data: notifications, refetch } = trpc.notifications.getAll.useQuery(
    { limit: 20 },
    { enabled: isOpen }
  );
  
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });
  
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });
  
  const deleteMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsReadMutation.mutate({ notificationId: notification.id });
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'credits_low':
      case 'credits_depleted':
        return '⚠️';
      case 'subscription_renewed':
        return '🎉';
      case 'subscription_expiring':
        return '⏰';
      case 'achievement_unlocked':
        return '🏆';
      case 'welcome':
        return '🚀';
      case 'milestone':
        return '🎯';
      default:
        return 'ℹ️';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {(unreadCount || 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          {(unreadCount || 0) > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
            >
              <Check className="w-4 h-4 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            notifications?.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 border-b cursor-pointer hover:bg-gray-50 transition',
                  !notification.read && 'bg-amber-50'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    
                    {notification.actionLabel && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto mt-1"
                      >
                        {notification.actionLabel} →
                      </Button>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate({ notificationId: notification.id });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
