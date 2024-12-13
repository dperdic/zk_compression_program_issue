use anchor_lang::prelude::*;
use light_sdk::{
    compressed_account::LightAccount, light_account, light_accounts, light_program,
    merkle_context::PackedAddressMerkleContext,
};

declare_id!("pst8edPuyRh6MEdhGJPZGQRQpUcHS6V3fnwMFLcFxBZ");

const PDA_DUMMY_SEED: &[u8; 2] = b"ds";

#[light_program]
#[program]
pub mod zk_counter {
    use super::*;

    pub fn create<'info>(ctx: LightContext<'_, '_, '_, 'info, Create<'info>>) -> Result<()> {
        ctx.light_accounts.counter.owner = ctx.accounts.signer.key();
        ctx.light_accounts.counter.counter = 0;

        Ok(())
    }

    pub fn increment<'info>(ctx: LightContext<'_, '_, '_, 'info, Increment<'info>>) -> Result<()> {
        ctx.light_accounts.counter.counter += 1;

        Ok(())
    }

    pub fn init_and_increment<'info>(
        ctx: LightContext<'_, '_, '_, 'info, InitAndIncrement<'info>>,
        subscription_id: String,
    ) -> Result<()> {
        msg!("hello");

        ctx.light_accounts.dummy.subscription_id = subscription_id;

        ctx.light_accounts.counter.counter += 1;

        Ok(())
    }

    pub fn delete<'info>(ctx: LightContext<'_, '_, '_, 'info, Delete<'info>>) -> Result<()> {
        Ok(())
    }
}

#[light_account]
#[derive(Clone, Debug, Default)]
pub struct CounterCompressedAccount {
    #[truncate]
    pub owner: Pubkey,
    pub counter: u64,
}

#[error_code]
pub enum CustomError {
    #[msg("No authority to perform this action")]
    Unauthorized,
}

#[light_accounts]
pub struct Create<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::ZkCounter>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,
    #[light_account(init, seeds = [b"counter", signer.key().as_ref()])]
    pub counter: LightAccount<CounterCompressedAccount>,
}

#[light_accounts]
pub struct Increment<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::ZkCounter>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,

    #[light_account(
        mut,
        seeds = [b"counter", signer.key().as_ref()],
        constraint = counter.owner == signer.key() @ CustomError::Unauthorized
    )]
    pub counter: LightAccount<CounterCompressedAccount>,
}

#[light_accounts]
#[instruction(subscription_id: String)]
pub struct InitAndIncrement<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::ZkCounter>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,

    #[account()]
    pub dummy_account: AccountInfo<'info>,

    #[light_account(
        mut,
        seeds = [b"counter", signer.key().as_ref()],
        constraint = counter.owner == signer.key() @ CustomError::Unauthorized
    )]
    pub counter: LightAccount<CounterCompressedAccount>,

    #[light_account(
        init,
        seeds=[PDA_DUMMY_SEED, dummy_account.key().as_ref(), subscription_id.as_ref()],
    )]
    pub dummy: LightAccount<DummyStruct>,
}

#[light_accounts]
pub struct Delete<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::ZkCounter>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,

    #[light_account(
        close,
        seeds = [b"counter", signer.key().as_ref()],
        constraint = counter.owner == signer.key() @ CustomError::Unauthorized
    )]
    pub counter: LightAccount<CounterCompressedAccount>,
}

#[light_account]
#[derive(Clone, Debug, Default)]
pub struct DummyStruct {
    pub subscription_id: String,
}
