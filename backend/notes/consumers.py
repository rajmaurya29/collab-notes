from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NoteConsumer(AsyncWebsocketConsumer):
    current_user={}
    async def connect(self):
        self.note_id = self.scope['url_route']['kwargs']['note_id']
        self.room_group_name = f'note_{self.note_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
 
        await self.accept()

    async def receive(self, text_data):
        
        data = json.loads(text_data)
        content = data.get('content')
        
        sender_id=data.get('senderId')
        # print(sender_id)
        if data.get("type")=='join':
            username=data.get('username')
            if sender_id not in self.current_user:
                self.current_user[str(sender_id)]=username
            # self.current_user.append(username)
            # print("joined")
            # current_username=list(self.current_user.values())

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_joined',
                    'username': username,
                    'senderId':sender_id,
                    'current_user':self.current_user
                }
            )
            return

        if data.get("type")=="left":
            # print("left")
            sender_id=data.get("senderId")
            username=data.get("username")
            if str(sender_id) in self.current_user:
                # print("removed")
                self.current_user.pop(str(sender_id))
                # print(self.current_user)
            # self.current_user.remove(username)
            # current_username=list(self.current_user.values())
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_left',
                    'username': username,
                    'senderId':sender_id,
                    'current_user':self.current_user
                }
            )
            return
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'note_update',
                'content': content,
                'senderId':sender_id
            }
        )

    async def note_update(self, event):
        await self.send(text_data=json.dumps({
            'content': event['content'],
            'senderId':event['senderId'],
        }))

    async def user_joined(self, event):
        await self.send(text_data=json.dumps({
            'type':"join",
            'username': event['username'],
            'senderId':event['senderId'],
            'current_user':event['current_user']
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    
    async def user_left(self, event):
        await self.send(text_data=json.dumps({
            'type':"left",
            'username': event['username'],
            'senderId':event['senderId'],
            'current_user':event['current_user']
        }))
