from langgraph.prebuilt import create_react_agent

from src.tools.blockchain_tools import (
    get_latest_block_number,
    get_block_info,
    get_celo_stats,
)
from src.utils.llm_factory import create_llm_model


def create_blockchain_agent():
    """
    Create a blockchain agent specialized for Celo blockchain operations.

    Returns:
        A LangGraph agent that can interact with the Celo blockchain.
    """
    # Create the model using the dynamic LLM selection
    model = create_llm_model()

    # Define blockchain tools
    blockchain_tools = [get_latest_block_number, get_block_info, get_celo_stats]

    # Create the agent with ReAct framework
    blockchain_agent = create_react_agent(
        model=model,
        tools=blockchain_tools,
        name="blockchain_expert",
        prompt=(
            "You are a blockchain expert specialized in Celo blockchain operations. "
            "You have access to tools that allow you to fetch data from the Celo blockchain. "
            "When asked about blockchain data, always use the appropriate tool to fetch real-time data. "
            "Do not make up information about blockchain state - always use tools to fetch current data. "
            "Explain the blockchain concepts and data in a clear, accessible way."
        ),
    )

    return blockchain_agent
