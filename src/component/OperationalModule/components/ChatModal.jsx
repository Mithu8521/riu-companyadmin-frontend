import { useEffect, useRef, useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import './chatModal.css';
import { getSocket, initSocket } from '../../header/socketClient';

function normalizeCreatedAt(input) {
  if (!input) return new Date().toISOString();
  if (input instanceof Date) return input.toISOString();
  if (typeof input === 'number') return new Date(input).toISOString();
  return new Date(input).toISOString();
}

// A new function to render the content with HTML elements
function renderEditableContent(rawText, taggedUsers) {
  if (!rawText) return <br />; // <br/> to maintain height for empty state

  let parts = [];
  let currentText = rawText;
  let lastIndex = 0;
  let keyIndex = 0;

  // Use a map for quick lookup and avoid re-filtering/sorting repeatedly
  const taggedMap = new Map(taggedUsers.map(u => [u.name.toLowerCase(), u]));

  // Regular expression to find potential mentions (e.g., words starting with @ or just the name)
  // This is a simplified regex; a real-world solution might need a more robust parser.
  const regex = new RegExp(`@?(${Array.from(taggedMap.keys()).map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  let match;
  while ((match = regex.exec(rawText)) !== null) {
    const matchText = match[0];
    const userNameMatch = match[1]; // The actual name part
    const user = taggedMap.get(userNameMatch.toLowerCase());

    if (user && match.index >= lastIndex) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(rawText.slice(lastIndex, match.index));
      }

      // Add the highlighted mention element
      parts.push(
        <span
          key={`mention-${keyIndex++}`}
          contentEditable="false" // Important: prevents editing inside the tag
          className="chat-input-mention-tag"
        >
          @{user.name}
        </span>
      );

      lastIndex = match.index + matchText.length;
      regex.lastIndex = lastIndex; // Update the index for the next search
    }
  }

  // Add remaining text
  if (lastIndex < rawText.length) {
    parts.push(rawText.slice(lastIndex));
  }

  return <>{parts}</>;
}
function getParticipantColor(id) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E76F51', '#2A9D8F', '#E9C46A', '#F4A261', '#8338EC'
  ];

  const hash = String(id).split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return colors[hash % colors.length];
}

function buildContentWithMarkers(rawText, taggedUsers) {
  if (!rawText || !Array.isArray(taggedUsers) || taggedUsers.length === 0) {
    return rawText;
  }
  let result = rawText;
  const sorted = [...taggedUsers].sort(
    (a, b) => (b.name || '').length - (a.name || '').length
  );

  sorted.forEach(user => {
    if (!user.name) return;
    const name = user.name.trim();
    if (!name) return;

    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Text will have @Name, but user might also type just Name; handle both:
    const regex = new RegExp(`@?\\b${escaped}\\b`, 'g');

    // Replace with marker @User(id)
    result = result.replace(regex, `@User(${user.id})`);
  });

  return result;
}

function getMentionSuggestions(mentionQuery, showMentionList, participants) {
  if (!showMentionList || !Array.isArray(participants) || participants.length === 0) {
    return [];
  }

  const lowerQuery = (mentionQuery || '').toLowerCase();
  const suggestions = [];

  // Handle "everyone"
  if (
    lowerQuery === '' ||
    'everyone'.startsWith(lowerQuery)
  ) {
    suggestions.push({ id: '__everyone__', name: 'Everyone' });
  }

  // Filter matching participants
  const userMatches = participants.filter(
    (p) => p.name && p.name.toLowerCase().includes(lowerQuery)
  );

  return [...suggestions, ...userMatches].slice(0, 20);
}


const ChatModal = ({
  show,
  onHide,
  title = 'Chat',
  participants: initialParticipants = [], 
  initialMessages = [],
  onSend = () => { },
  currentUserId = null,
  questionId,
  financialYearId,
  sourceId,
  subLocationId,
  fromDate,
  toDate,
  item,
  userForRole
}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [chatParticipants, setChatParticipants] = useState(initialParticipants);
  
  const [taggedUsers, setTaggedUsers] = useState([]);       
  const [hasEveryoneTag, setHasEveryoneTag] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');     // text after '@'
  const [mentionStart, setMentionStart] = useState(null);   // index of '@'
  const [cursorPos, setCursorPos] = useState(0);
  const [showMentionList, setShowMentionList] = useState(false);

  // participants popover + search
  const [showParticipantsPopover, setShowParticipantsPopover] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');

  const listRef = useRef(null);
  
  
  useEffect(() => {
      setChatParticipants(initialParticipants);
  }, [initialParticipants]);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const normalizedInitial = initialMessages.map((m) => ({
        id: m.id,
        senderId: m.senderId ?? 'system',
        content: (m.content ?? '').toString(),
        createdAt: normalizeCreatedAt(m.createdAt),
        senderName: `${m.senderUser?.first_name ?? 'Unknown'} ${m.senderUser?.last_name ?? ''}`.trim(),
        tags: m.mentions || m.tags || m.mention || [],
        isEveryone: !!m.isEveryone,
      }));
      setMessages(normalizedInitial);
    } else {
      setMessages([]);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
      }, 50);
    }
  }, [show]);

  function recalcTags(value) {
    const valLower = (value || '').toLowerCase();

    const hasEveryone = /\beveryone\b/i.test(value || '');
    let finalTagged = [];

    if (chatParticipants && chatParticipants.length > 0) {
      finalTagged = chatParticipants.filter(p => {
        if (!p.name) return false;
        const nameLower = p.name.toLowerCase();
        return valLower.includes(nameLower);
      });
    }

    setHasEveryoneTag(hasEveryone);
    setTaggedUsers(finalTagged);
  }

  function handleTextChange(e) {
    const value = e.target.value;
    const pos = e.target.selectionStart;

    setText(value);
    setCursorPos(pos);
    // detect active mention trigger
    const lastAt = value.lastIndexOf('@', pos - 1);
    if (lastAt !== -1) {
      const nextSpace = value.indexOf(' ', lastAt);
      const end = nextSpace === -1 ? pos : Math.min(nextSpace, pos);
      const query = value.slice(lastAt + 1, pos); // without '@'

      setMentionStart(lastAt);
      setMentionQuery(query);
      setShowMentionList(true);
    } else {
      setMentionStart(null);
      setMentionQuery('');
      setShowMentionList(false);
    }

    // recompute tagging
    recalcTags(value);
  }

  function handleSelectMention(p) {
    if (p.id === '__everyone__') {
      const updated = replaceMentionToken('everyone ');

      setText(updated);
      setHasEveryoneTag(true);

      if (chatParticipants && chatParticipants.length > 0) {
        const everyoneList = chatParticipants.filter(x => x.id !== currentUserId);
        setTaggedUsers(everyoneList);
      }
      setShowMentionList(false);
      recalcTags(updated);
      return;
    }
    const display = `${p.name} `;
    const updated = replaceMentionToken(display);

    setText(updated);
    setHasEveryoneTag(false);
    setTaggedUsers(prev => {
      if (prev.some(u => u.id === p.id)) return prev;
      return [...prev, p];
    });

    setShowMentionList(false);
    recalcTags(updated);
  }

  function replaceMentionToken(replacement) {
    if (mentionStart == null) return text;
    const before = text.slice(0, mentionStart);
    const after = text.slice(cursorPos);
    return before + replacement + after;
  }

  function handleSend() {
    const trimmed = text.trim();
    const hasTags = hasEveryoneTag || taggedUsers.length > 0;
    if (!trimmed || !hasTags || !chatParticipants || chatParticipants.length === 0) return;

    const recipientIds = hasEveryoneTag
      ? chatParticipants.filter(p => p.id !== currentUserId).map(p => p.id)
      : taggedUsers.map(p => p.id);

    const mentions = {
      isAll: hasEveryoneTag,
      userIds: recipientIds,
    };

    const contentForDb = buildContentWithMarkers(trimmed, taggedUsers);

    const newMessage = {
      id: Date.now(),
      senderId: currentUserId ?? 0,
      content: contentForDb,
      createdAt: new Date().toISOString(),
      mentions,
    };

    // clear input
    setText('');
    setTaggedUsers([]);
    setHasEveryoneTag(false);
    setMentionQuery('');
    setMentionStart(null);
    setShowMentionList(false);

    try {
      const recipients = chatParticipants.filter(p => recipientIds.includes(p.id));
      onSend(newMessage, recipients);

      if (
        userForRole?.role === 'Internal Auditor' ||
        userForRole?.role === 'External Auditor'
      ) {
        if (!hasSentFirstMessage) {
          setHasSentFirstMessage(true);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isCurrentUserParticipant =
    Array.isArray(chatParticipants) &&
    chatParticipants.some(p => p.id === currentUserId);

  function renderMessageContent(m) {
    const text = m.content || '';
    // Build an id -> participant map
    const idToUser = new Map();
    if (chatParticipants && chatParticipants.length > 0) {
      chatParticipants.forEach(p => idToUser.set(p.id, p));
    }

    const parts = [];
    const regex = /@?\s*User\s*\(\s*(\d+)\s*\)/g;
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const userId = Number(match[1]);
      const participant = idToUser.get(userId);
      const name = participant?.name || `User ${userId}`;

      parts.push(
        <span key={`mention-${m.id}-${keyIndex++}`} className="mention-highlight">
          {name}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
  }

  function renderMessage(m) {
    const isMine =
      (currentUserId !== null && m.senderId === currentUserId) ||
      (currentUserId === null && m.senderId === 'you');
    const senderName = m.senderName || 'Unknown';
    const senderColor = getParticipantColor(m.senderId);

    return (
      <div
        key={m.id}
        className={`d-flex mb-3 ${isMine ? 'justify-content-end is-mine' : 'justify-content-start'}`}
        style={{ animation: 'fadeIn 0.3s ease-in' }}
      >
        <div style={{ maxWidth: '70%' }}>
          {!isMine && (
            <div
              style={{
                fontSize: '0.8rem',
                marginBottom: '4px',
                marginLeft: '8px',
                color: senderColor,
                fontWeight: '600'
              }}
            >
              {senderName}
            </div>
          )}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              backgroundColor: isMine ? '#007bff' : '#f8f9fa',
              color: isMine ? 'white' : '#2c3e50',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: isMine ? 'none' : '1px solid #e9ecef',
              position: 'relative'
            }}
          >
            <div style={{ marginBottom: '4px', lineHeight: '1.5' }}>
              {renderMessageContent(m)}
            </div>

            {Array.isArray(m.tags) && m.tags.length > 0 && (
              <div
                style={{
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  marginBottom: '2px'
                }}
              >
                To:{' '}
                {m.isEveryone
                  ? 'Everyone'
                  : chatParticipants && chatParticipants.length > 0
                    ? chatParticipants
                      .filter(p => m.tags.includes(p.id))
                      .map(p => p.name)
                      .join(', ')
                    : 'Unknown'}
              </div>
            )}
            <div
              style={{
                fontSize: '0.7rem',
                opacity: isMine ? 0.8 : 0.6,
                textAlign: 'right'
              }}
            >
              {new Date(m.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mentionSuggestions = getMentionSuggestions(
    mentionQuery,
    showMentionList,
    chatParticipants
  );


  const canSend =
    text.trim().length > 0 &&
    (hasEveryoneTag || taggedUsers.length > 0) &&
    chatParticipants &&
    chatParticipants.length > 0 &&
    isCurrentUserParticipant;

  // NEW: Direct state update handler
  const handleParticipantUpdate = (data) => {
    console.log('[chat] Participants update data received:', data);
    if (data && Array.isArray(data.participants)) {
        // Direct state update from socket payload
        setChatParticipants(data.participants); 
    }
  };


  useEffect(() => {
    if (!show) return;
    if (!questionId || !financialYearId) return;
    if (!isCurrentUserParticipant) return;

    const isAuditor =
      userForRole?.role === 'Internal Auditor' ||
      userForRole?.role === 'External Auditor';

    const hasOwnMessage =
      Array.isArray(initialMessages) &&
      initialMessages.some(m => m.senderId === currentUserId);

    if (isAuditor) {
      if (hasOwnMessage && !hasSentFirstMessage) {
        setHasSentFirstMessage(true);
      }
      if (!hasOwnMessage && !hasSentFirstMessage) {
        return;
      }
    } else {
      if (!hasSentFirstMessage) {
        setHasSentFirstMessage(true);
      }
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const userId = currentUser?.id;
    if (!userId) {
      console.error('No userId in localStorage');
      return;
    }
    if(!sourceId){
      console.error('No location Found');
      return;
    }
    const roomName = `chat_${questionId}_${financialYearId}_${sourceId}_${subLocationId ?? "NULL"}_${fromDate || "NULL"}_${toDate || "NULL"}`;

    let socket = getSocket();
    if (!socket) {
      console.warn('[chat] no global socket, init now');
      socket = initSocket(userId);
    }
    if (!socket) {
      console.error('[chat] failed to init socket');
      return;
    }

    socket.emit('joinChatRoom', { roomName });

    const handleNewMsg = (msg) => {
      const normalized = {
        id: msg.id,
        senderId: msg.senderId ?? 'system',
        content: (msg.content ?? '').toString(),
        createdAt: normalizeCreatedAt(msg.createdAt),
        senderName: msg.senderName ?? msg.senderName ?? 'Unknown',
        tags: msg.mentions?.userIds || [],
        isEveryone: !!msg.mentions?.isAll,
      };

      setMessages(prev => {
        if (prev.some(m => m.id === normalized.id)) return prev;
        return [...prev, normalized];
      });
    };

    socket.on('chatNewMessage', handleNewMsg);
    
    // Listen for the socket event and call the local handler
    socket.on('chatParticipantsUpdate', handleParticipantUpdate);

    return () => {
      if (socket) {
        socket.off('chatNewMessage', handleNewMsg);
        socket.off('chatParticipantsUpdate', handleParticipantUpdate); // Cleanup the listener
        socket.emit('leaveChatRoom', { roomName });
      }
    };
  }, [
    show,
    questionId,
    financialYearId,
    sourceId,
    subLocationId,
    fromDate,
    toDate,
    hasSentFirstMessage,
    isCurrentUserParticipant,
    currentUserId,
    userForRole?.role,
    initialMessages,
    handleParticipantUpdate // Include the handler in dependencies
  ]);

  const totalParticipants = Array.isArray(chatParticipants) ? chatParticipants.length : 0;

  const filteredParticipants = Array.isArray(chatParticipants)
    ? chatParticipants.filter(p =>
      (p.name || '')
        .toLowerCase()
        .includes((participantSearch || '').toLowerCase())
    )
    : [];

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header
          closeButton
          style={{
            borderBottom: '2px solid #f1f3f5',
            padding: '1rem 1.5rem'
          }}
        >
          <Modal.Title style={{ fontWeight: '600', color: '#2c3e50' }}>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#fafbfc',
            display: 'flex',
            flexDirection: 'column',
            height: '600px' // controls overall modal body height
          }}
        >
          {!isCurrentUserParticipant ? (
            <div className="text-center text-muted py-5 modal-full-center">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>🔒</div>
              <div style={{ fontSize: '1rem', fontWeight: '500' }}>
                You are not a participant in this chat.
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Only assigned participants can view and send messages here.
              </div>
            </div>
          ) : (
            <>
              {/* Participants section (top, non-scrollable) */}
              <div
                className="mb-3 p-3"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  flexShrink: 0
                }}
              >
                {!chatParticipants || chatParticipants.length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.4 }}>
                      👥
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      No participants available
                    </div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      Add participants to start chatting
                    </div>
                  </div>
                ) : (
                  <div className="chat-participants-bar">
                    <div
                      className="chat-participants-hover-area"
                      onMouseEnter={() => setShowParticipantsPopover(true)}
                      onMouseLeave={() => setShowParticipantsPopover(false)}
                    >
                      {/* Trigger */}
                      <div className="chat-participants-trigger">
                        <div className="chat-group-avatar">
                          <span className="chat-group-avatar-icon">👥</span>
                        </div>
                        <div className="chat-participants-label">
                          {totalParticipants === 1
                            ? '1 participant'
                            : `${totalParticipants} participants`}
                        </div>
                      </div>

                      {/* Dropdown */}
                      {showParticipantsPopover && (
                        <div className="chat-participants-popover">
                          <div className="chat-participants-search-wrapper">
                            <input
                              type="text"
                              className="chat-participants-search"
                              placeholder="Search participants..."
                              value={participantSearch}
                              onChange={e => setParticipantSearch(e.target.value)}
                            />
                          </div>

                          <div className="chat-participants-list chat-scrollbar">
                            {filteredParticipants.length === 0 ? (
                              <div className="chat-participants-empty">
                                No participant found
                              </div>
                            ) : (
                              filteredParticipants.map(p => {
                                const color = getParticipantColor(p.id);
                                return (
                                  <div
                                    key={p.id}
                                    className="chat-participant-row"
                                    title={p.name}
                                  >
                                    <div
                                      className="chat-participant-avatar"
                                      style={{
                                        backgroundColor: color,
                                        boxShadow: `0 2px 8px ${color}40`
                                      }}
                                    >
                                      {(p.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="chat-participant-info">
                                      <div className="chat-participant-name">
                                        {p.name}
                                      </div>
                                      {p.email && (
                                        <div className="chat-participant-email">
                                          {p.email}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages area (middle, scrollable, flex:1) */}
              <div
                ref={listRef}
                className="mb-3 chat-scrollbar"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {messages.length === 0 ? (
                  <div
                    className="text-center text-muted py-5 modal-full-center"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                      💬
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '500' }}>
                      No messages yet
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Start the conversation below and mention people by name.
                    </div>
                  </div>
                ) : (
                  messages.map(renderMessage)
                )}
              </div>

              {/* Input Section (bottom, fixed within modal body) */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <InputGroup
                    style={{
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      borderRadius: '12px',
                      backgroundColor: 'white'
                    }}
                  >
                    <Form.Control
                      as="textarea"
                      rows={1}
                      placeholder={
                        !chatParticipants || chatParticipants.length === 0
                          ? 'Add participants to start chatting...'
                          : 'Type your message and mention people by name or everyone...'
                      }
                      value={text}
                      onChange={handleTextChange}
                      onKeyDown={onKeyDown}
                      className="chat-input"
                      disabled={
                        !chatParticipants ||
                        chatParticipants.length === 0 ||
                        !isCurrentUserParticipant
                      }
                      style={{
                        resize: 'none',
                        border: 'none',
                        borderRadius: '12px 0 0 12px',
                        padding: '12px 16px',
                        fontSize: '0.95rem'
                      }}
                    />
                    <Button
                      variant="primary"
                      onClick={handleSend}
                      disabled={!canSend}
                      style={{
                        borderRadius: '0 12px 12px 0',
                        padding: '0 24px',
                        fontWeight: '600',
                        backgroundColor: canSend ? '#007bff' : '#8fbaf5',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        cursor: canSend ? 'pointer' : 'not-allowed'
                      }}
                      onMouseOver={e => {
                        if (canSend) e.target.style.backgroundColor = '#0056b3';
                      }}
                      onMouseOut={e => {
                        e.target.style.backgroundColor = canSend ? '#007bff' : '#8fbaf5';
                      }}
                    >
                      Send
                    </Button>
                  </InputGroup>
                </Form>

                {/* mention dropdown */}
                {showMentionList && mentionSuggestions.length > 0 && (
                  <div className="mention-dropdown">
                    {mentionSuggestions.map(p => (
                      <div
                        key={p.id}
                        className="mention-item"
                        onMouseDown={e => {
                          // prevent textarea blur
                          e.preventDefault();
                          handleSelectMention(p);
                        }}
                      >
                        {p.id === '__everyone__' ? (
                          <span>Everyone</span>
                        ) : (
                          <span>{p.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!canSend && text.trim().length > 0 && (
                  <div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#e67e22' }}>
                    {!chatParticipants || chatParticipants.length === 0 ? (
                      <>No participants available to send messages to.</>
                    ) : (
                      <>You must mention at least one participant or everyone to send.</>
                    )}
                  </div>
                )}
                {(!chatParticipants || chatParticipants.length === 0) && text.trim().length === 0 && (
                  <div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#95a5a6' }}>
                    Add participants to enable messaging.
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChatModal;