# Banking AI Agents & Tools Documentation

This document provides a comprehensive overview of all available agents in the Zaman Bank agentic system and their specialized tools.

## Agent Architecture Overview

The system uses a **Router Agent** that analyzes user requests and routes them to the most appropriate specialist agent. Each agent has access to specific tools and knowledge domains.

---

## 🔀 Router Agent

**Name**: Router Agent
**Purpose**: Analyzes incoming user requests and routes them to the appropriate specialist agent
**Language**: Russian (Kazakh market)

**Routing Logic**: Uses GPT reasoning to determine which agent can best handle the user's request based on:
- Request content analysis
- Agent capabilities matching
- Context understanding

**Available Target Agents**: Product Agent, Account Agent, QA Agent, Planner Agent

---

## 🏦 Product Agent

**Name**: Product Agent
**Description**: Агент, который помогает пользователям с запросами о продуктах, рекомендациями и получением информации о различных продуктах. А также с пользовательскими продуктами и их деталями. Предоставляет помощь с созданием продуктов и рекомендациями на основе предпочтений и потребностей пользователя.

**Language**: Russian
**Tools Configuration**: `./chat/tools/tools_products.json`

### Available Tools:

#### 1. `get_bank_products`
- **Purpose**: Retrieves a list of all available bank products
- **Parameters**: None required
- **Returns**: List of Product objects with ID, name, type ID, description, and attributes
- **Use Case**: When customers ask "What products do you offer?" or need to browse available services

#### 2. `create_bank_product`
- **Purpose**: Creates a new bank account for a user based on a specific product ID
- **Parameters**:
  - `user_id` (integer, required): The ID of the user
  - `product_id` (integer, required): The ID of the bank product to create
- **Returns**: Newly created Account object with ID, product ID, user ID, balance, currency, and status
- **Use Case**: When customers want to open new accounts or subscribe to products

#### 3. `get_user_bank_products`
- **Purpose**: Retrieves the specific bank products a user currently has
- **Parameters**:
  - `user_id` (integer, required): The ID of the user whose products are being retrieved
- **Returns**: List of Product objects the user is subscribed to
- **Use Case**: When customers ask "What products do I currently have?"

**Sample Interactions**:
- "Какие у вас депозитные продукты?" → Lists available deposit products
- "Хочу открыть сберегательный счет" → Creates new savings account
- "Какие продукты у меня есть?" → Shows user's current products

---

## 💳 Account Agent

**Name**: Account Agent
**Description**: Единый Менеджер Счетов, безопасный, человекоподобный банковский помощник для Заман Банка. Имеет доступ к комплексным банковским инструментам для запросов баланса счета и денежных переводов.

**Language**: Russian
**Security**: Requires confirmation for transactions
**Tools Configuration**: `./chat/tools/tools_account.json`

### Available Tools:

#### 1. `get_account_balance`
- **Purpose**: Retrieve the current balance for account ID 1 (user's main account)
- **Parameters**:
  - `account_id` (string, required): Account identifier - always use '1' for the user's account
- **Returns**: Current account balance in KZT
- **Use Case**: Balance inquiries, account status checks

#### 2. `transfer_funds`
- **Purpose**: Transfer money from user's account (ID 1) to another account
- **Security**: Always confirms with user before execution
- **Parameters**:
  - `amount` (number, required): Transfer amount in KZT
  - `memo` (string, optional): Optional memo or purpose of transfer
  - `to_account_id` (integer, optional): Destination account ID (2-10). Random if not provided
- **Returns**: Transfer confirmation details
- **Use Case**: Money transfers, payments, sending funds

**Sample Interactions**:
- "Какой у меня баланс?" → Shows current balance
- "Переведи 50000 тенге на счет 5" → Executes transfer after confirmation
- "Покажи мои последние транзакции" → Account transaction history

---

## 📊 Planner Agent

**Name**: Planner Agent
**Description**: Используйте этого агента, когда пользователь просит помощи с финансовым планом или целью, например, накоплением на машину, дом или отпуск.

**Language**: Russian
**Specialization**: Financial planning, savings goals, purchase planning
**Tools Configuration**: `tools_planner.json`

### Available Tools:

#### 1. `get_financial_status`
- **Purpose**: Retrieve the user's complete financial status including debt, savings, and impulse spending index
- **Parameters**:
  - `user_id` (string, required): Unique identifier for the user (always use '1')
- **Returns**: Comprehensive financial status including:
  - Debt levels and debt-to-income ratio
  - Savings capacity
  - Spending patterns analysis
  - Financial health indexes
- **Use Case**: Financial assessment before creating plans

### Financial Planning Capabilities:
- **Goal Setting**: Helps users set realistic financial targets
- **Timeline Planning**: Creates step-by-step savings plans with timelines
- **Spending Analysis**: Analyzes transaction history for optimization
- **Product Recommendations**: Suggests appropriate banking products for goals

**Sample Interactions**:
- "Я хочу купить машину за 10 млн в течение 3 года" → Creates detailed savings plan
- "Помоги накопить на отпуск" → Develops vacation savings strategy
- "Хочу купить квартиру" → Comprehensive home purchase planning

---

## ❓ QA Agent

**Name**: QA Agent
**Description**: Этот агент отвечает на общие вопросы о продуктах и услугах, предоставляемых банком, и отвечает на часто задаваемые вопросы из базы знаний.

**Language**: Russian
**Knowledge Base**: `./chat/Zamanbank_kb.txt`
**Tools**: No specialized tools - uses knowledge base retrieval

### Capabilities:
- **FAQ Responses**: Answers frequently asked questions
- **Policy Information**: Provides information about bank policies
- **General Guidance**: Offers general banking advice
- **Service Information**: Details about bank services and procedures

**Knowledge Domains**:
- Banking procedures and policies
- Account types and features
- Interest rates and fees
- Service availability and hours
- General financial education

**Sample Interactions**:
- "Какие у вас часы работы?" → Provides bank operating hours
- "Какие комиссии за переводы?" → Details transfer fees
- "Как закрыть счет?" → Account closure procedures

---

## 🔄 Alternative Planner Class

**Name**: Planner (simplified version)
**Purpose**: Lightweight financial planning without full agent infrastructure
**Tools**: Direct API calls to financial planning functions

### Available Tools:
- `get_financial_status()`: User financial assessment
- `get_transaction_history()`: Recent transaction analysis
- `create_financial_plan()`: Direct plan generation

---

## 🏗️ System Integration

### Tool Definition Format
All tools are defined in JSON format with OpenAI function calling schema:
```json
{
  "type": "function",
  "name": "tool_name",
  "description": "Tool description",
  "parameters": {
    "type": "object",
    "properties": { ... },
    "required": [ ... ]
  }
}
```

### Error Handling
- **Input Validation**: All tools validate required parameters
- **Error Responses**: Structured error messages for invalid inputs
- **Fallback Mechanisms**: Router fallback for unrecognized requests

### Security Features
- **Transaction Confirmation**: Account Agent requires user confirmation for transfers
- **Parameter Validation**: Strict parameter validation for all financial operations
- **Access Control**: Each agent only accesses tools within their domain

### Currency & Localization
- **Primary Currency**: Kazakhstan Tenge (KZT)
- **Language**: Russian for the Kazakh market
- **Number Formatting**: Local currency formatting standards

---

## 📈 Usage Analytics

**Most Common Routing Patterns**:
1. Financial planning requests → Planner Agent
2. Account operations → Account Agent
3. Product inquiries → Product Agent
4. General questions → QA Agent

**Tool Usage Frequency**:
1. `get_financial_status` - Financial assessments
2. `get_account_balance` - Balance inquiries
3. `get_bank_products` - Product browsing
4. `transfer_funds` - Money transfers

This documentation provides a complete reference for understanding and utilizing the Zaman Bank agentic system's capabilities.