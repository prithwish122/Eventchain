// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EventTicketing {
    address public owner;
    uint256 private _eventIds;
    uint256 private _ticketIds;
    
    struct Event {
        string name;
        string description;
        uint256 price;
        uint256 totalSupply;
        uint256 availableTickets;
        uint256 eventDate;
        bool isActive;
        address organizer;
    }

    struct Ticket {
        uint256 eventId;
        address owner;
        bool isUsed;
        uint256 purchaseDate;
    }

    // Mappings
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(address => mapping(uint256 => uint256[])) private ticketsByOwner;
    mapping(uint256 => mapping(address => bool)) private hasTicket;

    // Events
    event EventCreated(
        uint256 indexed eventId,
        string name,
        uint256 price,
        uint256 totalSupply,
        address organizer
    );
    
    event TicketPurchased(
        uint256 indexed eventId,
        uint256 indexed ticketId,
        address buyer,
        uint256 price
    );
    
    event TicketUsed(
        uint256 indexed ticketId,
        uint256 indexed eventId,
        address owner
    );

    event TicketTransferred(
        uint256 indexed ticketId,
        address indexed from,
        address indexed to
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier eventExists(uint256 eventId) {
        require(events[eventId].isActive, "Event does not exist");
        _;
    }

    modifier ticketExists(uint256 ticketId) {
        require(tickets[ticketId].owner != address(0), "Ticket does not exist");
        _;
    }

    modifier onlyTicketOwner(uint256 ticketId) {
        require(tickets[ticketId].owner == msg.sender, "Not ticket owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createEvent(
        string memory name,
        string memory description,
        uint256 price,
        uint256 totalSupply,
        uint256 eventDate
    ) external returns (uint256) {
        require(eventDate > block.timestamp, "Event date must be in future");
        require(totalSupply > 0, "Total supply must be positive");
        
        _eventIds++;
        uint256 newEventId = _eventIds;
        
        events[newEventId] = Event({
            name: name,
            description: description,
            price: price,
            totalSupply: totalSupply,
            availableTickets: totalSupply,
            eventDate: eventDate,
            isActive: true,
            organizer: msg.sender
        });

        emit EventCreated(newEventId, name, price, totalSupply, msg.sender);
        return newEventId;
    }

    function purchaseTicket(uint256 eventId) external payable eventExists(eventId) returns (uint256) {
        Event storage eventItem = events[eventId];
        
        require(eventItem.availableTickets > 0, "No tickets available");
        require(msg.value >= eventItem.price, "Insufficient payment");
        require(eventItem.eventDate > block.timestamp, "Event has ended");
        require(!hasTicket[eventId][msg.sender], "Already has ticket");

        _ticketIds++;
        uint256 newTicketId = _ticketIds;

        tickets[newTicketId] = Ticket({
            eventId: eventId,
            owner: msg.sender,
            isUsed: false,
            purchaseDate: block.timestamp
        });

        ticketsByOwner[msg.sender][eventId].push(newTicketId);
        hasTicket[eventId][msg.sender] = true;
        eventItem.availableTickets--;

        // Return excess payment
        if (msg.value > eventItem.price) {
            payable(msg.sender).transfer(msg.value - eventItem.price);
        }

        // Transfer payment to event organizer
        payable(eventItem.organizer).transfer(eventItem.price);

        emit TicketPurchased(eventId, newTicketId, msg.sender, eventItem.price);
        return newTicketId;
    }

    function useTicket(uint256 ticketId) 
        external 
        ticketExists(ticketId) 
        onlyTicketOwner(ticketId) 
    {
        Ticket storage ticket = tickets[ticketId];
        Event storage eventItem = events[ticket.eventId];
        
        require(!ticket.isUsed, "Ticket already used");
        require(block.timestamp >= eventItem.eventDate, "Event has not started");
        require(block.timestamp <= eventItem.eventDate + 1 days, "Event has expired");

        ticket.isUsed = true;
        emit TicketUsed(ticketId, ticket.eventId, msg.sender);
    }

    function transferTicket(uint256 ticketId, address to) 
        external 
        ticketExists(ticketId) 
        onlyTicketOwner(ticketId) 
    {
        require(to != address(0), "Invalid recipient");
        require(to != msg.sender, "Cannot transfer to self");
        
        Ticket storage ticket = tickets[ticketId];
        require(!ticket.isUsed, "Ticket already used");
        require(block.timestamp < events[ticket.eventId].eventDate, "Event has ended");

        // Remove ticket from sender's ownership
        hasTicket[ticket.eventId][msg.sender] = false;
        
        // Update ticket ownership
        ticket.owner = to;
        hasTicket[ticket.eventId][to] = true;

        emit TicketTransferred(ticketId, msg.sender, to);
    }

    // View functions
    function getEvent(uint256 eventId) external view returns (Event memory) {
        require(events[eventId].isActive, "Event does not exist");
        return events[eventId];
    }

    function getTicket(uint256 ticketId) external view returns (Ticket memory) {
        require(tickets[ticketId].owner != address(0), "Ticket does not exist");
        return tickets[ticketId];
    }

    function getMyTickets(uint256 eventId) external view returns (uint256[] memory) {
        return ticketsByOwner[msg.sender][eventId];
    }

    function getEventCount() external view returns (uint256) {
        return _eventIds;
    }

    function validateTicket(uint256 ticketId) external view returns (bool, string memory) {
        if (tickets[ticketId].owner == address(0)) {
            return (false, "Ticket does not exist");
        }
        
        Ticket memory ticket = tickets[ticketId];
        Event memory eventItem = events[ticket.eventId];
        
        if (ticket.isUsed) {
            return (false, "Ticket has already been used");
        }
        
        if (block.timestamp < eventItem.eventDate) {
            return (false, "Event has not started yet");
        }
        
        if (block.timestamp > eventItem.eventDate + 1 days) {
            return (false, "Event has expired");
        }
        
        return (true, "Ticket is valid");
    }
}