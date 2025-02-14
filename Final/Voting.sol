// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voting {
    struct Candidate {
        string name;
        uint256 votes;
    }

    address public admin;
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event VoteCast(string candidate, address voter, uint256 totalVotes);

    constructor(string[] memory _candidateNames) {
        admin = msg.sender;
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate(_candidateNames[i], 0));
        }
    }

    function vote(uint _candidateIndex) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate.");

        candidates[_candidateIndex].votes++;
        hasVoted[msg.sender] = true;

        emit VoteCast(candidates[_candidateIndex].name, msg.sender, candidates[_candidateIndex].votes);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
