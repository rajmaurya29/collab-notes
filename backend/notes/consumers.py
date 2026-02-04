from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NoteConsumer(AsyncWebsocketConsumer):
    
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
        msg_type=data.get('type')
        content = data.get('content')
        sender_id=data.get('senderId')
        username=data.get('username')
        # print(sender_id)

        if msg_type=='join':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'user_joined',
                    'senderId':sender_id,
                    'username':username
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

    async def user_joined(self,event):
        await self.send(text_data=json.dumps({
            'type':"join",
            'username':event['username'],
            'senderId':event['senderId']
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
