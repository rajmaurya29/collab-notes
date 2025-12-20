from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NoteConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.note_id = self.scope['url_route']['kwargs']['note_id']
        self.room_group_name = f'note_{self.note_id}'

        # join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('content')

        # broadcast to others
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'note_update',
                'content': content,
            }
        )

    async def note_update(self, event):
        await self.send(text_data=json.dumps({
            'content': event['content']
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
