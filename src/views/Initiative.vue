<template>
  <div id="initiative-view">

    <div>Status: {{ connectionState }}</div>
    <div class="flex gap-1">
      <q-input label="Server" dark v-model="connectionURL"/>
      <div class="center-button">
        <q-btn @click="connectToWebSocket" color="primary">Connect</q-btn>
      </div>
    </div>

    <div class="initiative-actions">
      <q-btn color="orange" @click="returnToPreviousPlayer" icon="keyboard_arrow_left">Previous</q-btn>
      <q-btn color="green" @click="continueToNextPlayer" icon-right="keyboard_arrow_right">Next</q-btn>
    </div>

    <div class="initiative-inputs">
      <q-input label="Player Name" dark v-model="newPlayerName"/>
      <q-input label="Initiative" dark type="number" v-model="initiative"/>
      <div class="center-button">
        <q-btn color="green" @click="addPlayer">Add</q-btn>
      </div>
    </div>

    <div>
      <q-list>
        <TransitionGroup name="initiative-list">
          <q-item class="initiative-item" v-for="player in initiativeList" :key="player.name">
            <q-item-section avatar>
              <q-icon color="yellow" :name="topOfTheRoundPlayer === player ? 'star' : ''"/>
            </q-item-section>
            <q-item-section>{{ player.name }} ({{ player.initiative }} initiative)</q-item-section>
            <q-item-section avatar>
              <q-btn
                  @click="removePlayer"
                  color="red"
                  :data-player-name="player.name"
                  icon="delete"
              />
            </q-item-section>
          </q-item>
        </TransitionGroup>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, Ref, ref} from "vue";

const connectionURL = ref('wss://dnd-service.astralibra.ch');
// const connectionURL = ref('ws://localhost:9002');

enum Command {
  ADD = 'add',
  NEXT = 'next',
  PREVIOUS = 'previous',
  REMOVE = 'remove',
}

enum STATE {
  CONNECTING = 0,
  CONNECTED = 1,
  DISCONNECTING = 2,
  DISCONNECTED = 3,
}

let webSocket: Ref<WebSocket | undefined> = ref(undefined);

const newPlayerName = ref('');
const initiative = ref(10);

// The initiative list cannot be an object (= has to be a string) since this breaks the list animation for some reason.
// It would be nice to know why that happens.
const initiativeList = ref<Player[]>([]);

const connectionState = computed(() => {
  if (webSocket.value === undefined) {
    return 'Not connected';
  }

  switch (webSocket.value.readyState) {
    case STATE.CONNECTING:
      return 'Connecting';
    case STATE.CONNECTED:
      return 'Connected';
    case STATE.DISCONNECTING:
      return 'Disconnecting';
    case STATE.DISCONNECTED:
      return 'Disconnected';
  }
});

const topOfTheRoundPlayer = computed(() => {
  if (initiativeList.value.length === 0) {
    return undefined;
  }

  let topOfTheRoundPlayer = initiativeList.value[0];

  for (const player of initiativeList.value) {
    if (player.initiative > topOfTheRoundPlayer.initiative) {
      topOfTheRoundPlayer = player;
    }
  }

  return topOfTheRoundPlayer;
});

/**
 * Sends the web socket command to move to the player with the next-lower initiative or to the top of the round.
 */
function continueToNextPlayer() {
  sendWebSocketCommand(Command.NEXT);
}

/**
 * Undo the last continue command.
 */
function returnToPreviousPlayer() {
  sendWebSocketCommand(Command.PREVIOUS);
}

/**
 * Sends the command to add a new player together with their name and initiative.
 */
function addPlayer() {
  if (newPlayerName.value !== '') {
    sendWebSocketCommand(Command.ADD, {
      name: newPlayerName.value,
      initiative: initiative.value
    });
    newPlayerName.value = '';
  }
}

/**
 * Remove a player by their name. (Uses the data attribute)
 * @param event
 */
function removePlayer(event: Event) {
  const target = event.target as HTMLSpanElement;
  const playerName: string | undefined = target?.parentElement?.parentElement?.dataset.playerName;
  if (playerName != null) {
    sendWebSocketCommand(Command.REMOVE, playerName);
  }
}

/**
 * When the user presses enter, the initiative continues to the next player.
 * @param event
 */
function handleKeyUpEvent(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    continueToNextPlayer();
  }
}

/**
 * When the site goes into background it disconnects the websocket after a while.
 * This function reconnects it when it comes back to visibility.
 * @param _
 */
function handleVisibilityChangeEvent(_: Event) {
  connectToWebSocket();
}

function sendWebSocketCommand(command: Command, data?: string | object) {
  let body = {
    command: command.toString(),
    data: data,
  };

  webSocket.value?.send(JSON.stringify(body));
}

onMounted(() => {
  document.addEventListener('keyup', handleKeyUpEvent);
  document.addEventListener('visibilitychange', handleVisibilityChangeEvent)
  connectToWebSocket();
});

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyUpEvent);
  document.removeEventListener('visibilitychange', handleVisibilityChangeEvent);
  webSocket.value?.close();
});

type Player = {
  name: string,
  initiative: number,
}

/**
 * Updates the player initiative list when it receives a message from the websocket.
 * @param message
 */
function handleReceiveMessageFromSocket(message: MessageEvent) {
  const receivedMessage: Player[] = JSON.parse(message.data);
  if (Array.isArray(receivedMessage)) {
    initiativeList.value = receivedMessage;
  }
}

/**
 * Connects to the websocket running on the connectionURL.
 */
function connectToWebSocket(): void {
  // If we are still connected, don't close and re-open the connection and instead just return.
  if (webSocket.value && webSocket.value.readyState === STATE.CONNECTED) {
    return;
  }

  webSocket.value = new WebSocket(connectionURL.value);

  webSocket.value?.addEventListener('message', handleReceiveMessageFromSocket);

  webSocket.value?.addEventListener('open', () => {
    console.log('Connected to WS!')
    console.log(webSocket.value);

    // TODO: This is a trick to ensure that the status message updates.
    // TODO: It would obviously be better if we didn't have to do this.
    const temp = webSocket.value;
    webSocket.value = undefined;
    webSocket.value = temp;
  });

  webSocket.value?.addEventListener('error', (error: any) => {
    console.error(error);
    console.error('Error occurred.');
    webSocket.value = undefined;
  });

  webSocket.value?.addEventListener('close', () => {
    console.log('Connection to websocket closed.');
    webSocket.value = undefined;
  });
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
#initiative-view {
  display: grid;
  gap: 2rem;
}

.initiative-item:first-child {
  background-color: #4caf50;
}

.initiative-item:nth-child(2) {
  background-color: #d57d04;
}


/* .initiative-list-move is used for animating the changes in the initiative list with the TransitionGroup tag. */
/*suppress CssUnusedSymbol */
.initiative-list-move {
  transition: all 0.5s ease;
}

.initiative-actions {
  display: flex;
  gap: 1rem;
}

.initiative-inputs {
  display: flex;
  gap: 0.8rem;
}

.center-button {
  padding: 1% 0;
}
</style>